"use client";

import { AdminOrderDetailDrawer } from "@/components/features/admin/orders/AdminOrderDetailDrawer";
import { AdminPanel } from "@/components/features/admin/shared/AdminPanel";
import {
  formatEuro,
  formatOrderDate,
  ORDER_STATUS_LABELS,
} from "@/lib/admin/adminOrderLabels";
import type { AdminOrderListItem, AdminOrderStatus } from "@/types/admin";
import {
  defaultPreset,
  DragDropManager,
  Draggable,
  Droppable,
} from "@dnd-kit/dom";
import { useEffect, useState } from "react";

type ExpeditionColumn = {
	id: string;
	code: string;
	title: string;
	statuses: AdminOrderStatus[];
	destination: AdminOrderStatus;
};

const COLUMNS: ExpeditionColumn[] = [
	{
		id: "to-prepare",
		code: "QUEUE.01",
		title: "À préparer",
		statuses: ["PENDING", "CONFIRMED", "TO_PREPARE"],
		destination: "TO_PREPARE",
	},
	{
		id: "preparing",
		code: "QUEUE.02",
		title: "En cours de préparation",
		statuses: ["PREPARING"],
		destination: "PREPARING",
	},
	{
		id: "ready",
		code: "QUEUE.03",
		title: "Prêt à partir",
		statuses: ["READY"],
		destination: "READY",
	},
	{
		id: "weather",
		code: "QUEUE.04",
		title: "Bloquées météo",
		statuses: ["HELD_WEATHER"],
		destination: "HELD_WEATHER",
	},
	{
		id: "shipped",
		code: "QUEUE.05",
		title: "Expédiées",
		statuses: ["SHIPPED"],
		destination: "SHIPPED",
	},
];

function ordersForColumn(orders: AdminOrderListItem[], column: ExpeditionColumn) {
	return orders.filter((order) => column.statuses.includes(order.status));
}

export function KanBanExpedition({ orders: initialOrders }: { orders: AdminOrderListItem[] }) {
	const [orders, setOrders] = useState(initialOrders);
	const [detailId, setDetailId] = useState<string | null>(null);
	const [error, setError] = useState("");

	useEffect(() => {
		setOrders(initialOrders);
	}, [initialOrders]);

	useEffect(() => {
		const manager = new DragDropManager(defaultPreset);
		const entities: Array<Draggable | Droppable> = [];
		const root = document.querySelector<HTMLElement>("[data-expedition-board]");

		if (!root) {
			manager.destroy();
			return;
		}

		root.querySelectorAll<HTMLElement>("[data-expedition-column]").forEach((element) => {
			const status = element.dataset.expeditionStatus as AdminOrderStatus;
			entities.push(
				new Droppable(
					{ id: element.dataset.expeditionColumn ?? status, element, data: { status } },
					manager
				)
			);
		});

		root.querySelectorAll<HTMLElement>("[data-expedition-order]").forEach((element) => {
			const orderId = element.dataset.expeditionOrder;
			if (!orderId) return;
			entities.push(new Draggable({ id: orderId, element, data: { orderId } }, manager));
		});

		const removeDragEnd = manager.monitor.addEventListener("dragend", (event) => {
			if (event.canceled || !event.operation.source || !event.operation.target) return;

			const sourceId = String(event.operation.source.id);
			const destinationStatus = event.operation.target.data.status as AdminOrderStatus | undefined;
			const currentOrder = orders.find((order) => order.id === sourceId);

			if (!currentOrder || !destinationStatus || currentOrder.status === destinationStatus) return;

			const previousOrders = orders;
			setError("");
			setOrders((current) =>
				current.map((order) =>
					order.id === sourceId ? { ...order, status: destinationStatus } : order
				)
			);

			void fetch(`/api/admin/orders/${sourceId}/status`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: destinationStatus }),
			}).then(async (response) => {
				if (!response.ok) throw new Error("status-update-failed");
				const body = (await response.json()) as { order?: AdminOrderListItem };
				if (body.order) {
					setOrders((current) =>
						current.map((order) => (order.id === sourceId ? { ...order, ...body.order } : order))
					);
				}
			}).catch(() => {
				setOrders(previousOrders);
				setError("Le déplacement n’a pas pu être enregistré. La commande a été restaurée.");
			});
		});

		return () => {
			removeDragEnd();
			entities.forEach((entity) => entity.destroy());
			manager.destroy();
		};
	}, [orders]);

	const liveOrders = orders.filter((order) => order.containsLive).length;
	const readyOrders = orders.filter((order) => order.status === "READY").length;
	const weatherOrders = orders.filter((order) => order.status === "HELD_WEATHER").length;

	return (
		<AdminPanel
			kicker="CONTROL / EXPÉDITIONS"
			title="Expéditions"
			action={<button type="button" onClick={() => window.location.reload()}>Actualiser</button>}
		>
			<section className="admin-logistics-summary" aria-label="Indicateurs des expéditions">
				<article>
					<span>LIVE.ORDERS</span>
					<strong>{liveOrders}</strong>
					<small>commandes avec vivant</small>
				</article>
				<article>
					<span>READY.TO.SHIP</span>
					<strong>{readyOrders}</strong>
					<small>prêtes sans blocage météo</small>
				</article>
				<article className={weatherOrders ? "warning" : ""}>
					<span>WEATHER.HOLD</span>
					<strong>{weatherOrders}</strong>
					<small>expédition(s) suspendue(s)</small>
				</article>
			</section>

			{error && <p className="admin-inline-error">{error}</p>}

			<div className="admin-shipping-board" data-expedition-board>
				{COLUMNS.map((column) => {
					const columnOrders = ordersForColumn(orders, column);
					return (
						<article
							key={column.id}
							className="admin-kanban-column"
							data-expedition-column={column.id}
							data-expedition-status={column.destination}
						>
							<header>
								<div>
									<span>{column.code}</span>
									<h3>{column.title}</h3>
								</div>
								<b>{columnOrders.length}</b>
							</header>

							<div className="admin-kanban-column-body">
								{columnOrders.length ? (
									columnOrders.map((order) => (
										<article
											key={order.id}
											className="admin-kanban-card"
											data-expedition-order={order.id}
											tabIndex={0}
											aria-label={`Commande ${order.reference}, ${ORDER_STATUS_LABELS[order.status]}`}
										>
											<div className="admin-kanban-card-topline">
												<strong>#{order.reference}</strong>
												<b>{formatEuro(order.total)}</b>
											</div>
											<span className="admin-kanban-customer">{order.customerName || "Client"}</span>
											<small>
												{order.containsLive ? "VIVANT" : "SEC"} · {order.itemCount} article
												{order.itemCount > 1 ? "s" : ""}
											</small>
											<button type="button" onClick={() => setDetailId(order.id)}>
												{formatOrderDate(order.createdAt)}
											</button>
										</article>
									))
								) : (
									<p className="admin-kanban-empty">AUCUNE COMMANDE</p>
								)}
							</div>
						</article>
					);
				})}
			</div>

			<AdminOrderDetailDrawer orderId={detailId} onClose={() => setDetailId(null)} />
		</AdminPanel>
	);
}
