"use client";

import React, { useState, useRef, MouseEvent as ReactMouseEvent } from "react";

// Types
type FieldType = "String" | "Number" | "Boolean" | "Date";
interface Field {
	id: string;
	name: string;
	type: FieldType;
}

interface DataModel {
	id: string;
	name: string;
	fields: Field[];
	x: number;
	y: number;
}

interface Connection {
	id: string;
	sourceModelId: string;
	sourceFieldId: string;
	targetModelId: string;
	targetFieldId: string;
	sourceSide: "left" | "right";
	targetSide: "left" | "right";
}

// Initial Mock Data
const initialModels: DataModel[] = [
	{
		id: "m1",
		name: "User",
		fields: [
			{ id: "f1", name: "id", type: "String" },
			{ id: "f2", name: "email", type: "String" },
			{ id: "f3", name: "createdAt", type: "Date" },
		],
		x: 100,
		y: 100,
	},
	{
		id: "m2",
		name: "Post",
		fields: [
			{ id: "f4", name: "id", type: "String" },
			{ id: "f5", name: "title", type: "String" },
			{ id: "f6", name: "content", type: "String" },
			{ id: "f7", name: "authorId", type: "String" },
		],
		x: 500,
		y: 150,
	},
];

export default function StudioPage() {
	const [models, setModels] = useState<DataModel[]>(initialModels);
	const [connections, setConnections] = useState<Connection[]>([]);

	// Transform State
	const [transform, setTransform] = useState({ x: 0, y: 0, zoom: 1 });
	const [isPanning, setIsPanning] = useState(false);
	const startPanRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

	// Node Dragging State
	const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
	const startDragRef = useRef({ mouseX: 0, mouseY: 0, nodeX: 0, nodeY: 0 });

	// Connection Drawing State
	const [drawingConnection, setDrawingConnection] = useState<{
		sourceModelId: string;
		sourceFieldId: string;
		sourceSide: "left" | "right";
		startX: number;
		startY: number;
		currentX: number;
		currentY: number;
	} | null>(null);

	// Dialogs State
	const [editingModel, setEditingModel] = useState<DataModel | null>(null);
	const [isModelDialogOpen, setIsModelDialogOpen] = useState(false);

	const [inlineEditingField, setInlineEditingField] = useState<{
		modelId: string;
		fieldId: string | "NEW";
	} | null>(null);

	// Hover Tracking for Snapping
	const [hoveredTarget, setHoveredTarget] = useState<{
		modelId: string;
		fieldId: string;
	} | null>(null);

	// --- Handlers for Canvas Panning & Zooming ---
	const handleCanvasMouseDown = (e: ReactMouseEvent) => {
		if ((e.target as HTMLElement).closest(".model-node")) return; // Ignore if clicking a node
		setIsPanning(true);
		startPanRef.current = {
			x: e.clientX,
			y: e.clientY,
			panX: transform.x,
			panY: transform.y,
		};
	};

	const handleCanvasMouseMove = (e: ReactMouseEvent) => {
		if (isPanning) {
			const dx = e.clientX - startPanRef.current.x;
			const dy = e.clientY - startPanRef.current.y;
			setTransform((prev) => ({
				...prev,
				x: startPanRef.current.panX + dx,
				y: startPanRef.current.panY + dy,
			}));
		} else if (draggingNodeId) {
			const dx = (e.clientX - startDragRef.current.mouseX) / transform.zoom;
			const dy = (e.clientY - startDragRef.current.mouseY) / transform.zoom;

			setModels((prev) => {
				const targetModel = prev.find((m) => m.id === draggingNodeId);
				if (!targetModel) return prev;

				let x = startDragRef.current.nodeX + dx;
				let y = startDragRef.current.nodeY + dy;

				return prev.map((m) => (m.id === draggingNodeId ? { ...m, x, y } : m));
			});
		} else if (drawingConnection) {
			const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;
			const canvasX = (mouseX - transform.x) / transform.zoom;
			const canvasY = (mouseY - transform.y) / transform.zoom;
			setDrawingConnection((prev) =>
				prev ? { ...prev, currentX: canvasX, currentY: canvasY } : null,
			);
		}
	};

	const handleCanvasMouseUp = () => {
		setIsPanning(false);

		if (draggingNodeId) {
			// Snap to grid on release
			setModels((prev) => {
				const targetModel = prev.find((m) => m.id === draggingNodeId);
				if (!targetModel) return prev;

				const tEl = document.getElementById(`model-${targetModel.id}`);
				const tw = tEl?.offsetWidth || 200;
				const th = tEl?.offsetHeight || 200;

				let x = Math.round(targetModel.x / 10) * 10;
				let y = Math.round(targetModel.y / 10) * 10;

				let overlapping = true;
				let iterations = 0;
				while (overlapping && iterations < 5) {
					overlapping = false;
					for (const other of prev) {
						if (other.id === targetModel.id) continue;
						const oEl = document.getElementById(`model-${other.id}`);
						const ow = oEl?.offsetWidth || 200;
						const oh = oEl?.offsetHeight || 200;

						const pad = 40;
						if (
							x < other.x + ow + pad &&
							x + tw + pad > other.x &&
							y < other.y + oh + pad &&
							y + th + pad > other.y
						) {
							overlapping = true;
							const pushLeft = x + tw + pad - other.x;
							const pushRight = other.x + ow + pad - x;
							const pushTop = y + th + pad - other.y;
							const pushBottom = other.y + oh + pad - y;

							const min = Math.min(pushLeft, pushRight, pushTop, pushBottom);
							if (min === pushLeft) x -= pushLeft;
							else if (min === pushRight) x += pushRight;
							else if (min === pushTop) y -= pushTop;
							else if (min === pushBottom) y += pushBottom;

							x = Math.round(x / 10) * 10;
							y = Math.round(y / 10) * 10;
						}
					}
					iterations++;
				}

				return prev.map((m) => (m.id === draggingNodeId ? { ...m, x, y } : m));
			});
		}

		setDraggingNodeId(null);
		setDrawingConnection(null);
		setHoveredTarget(null);
	};

	const handleWheel = (e: React.WheelEvent) => {
		// Zoom sensitivity
		const zoomSensitivity = 0.002;
		const delta = -e.deltaY * zoomSensitivity;

		// Calculate bounding rect synchronously before entering the state updater callback
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		setTransform((prev) => {
			const newZoom = Math.min(Math.max(0.1, prev.zoom * (1 + delta)), 3);

			const pointerX = (mouseX - prev.x) / prev.zoom;
			const pointerY = (mouseY - prev.y) / prev.zoom;

			return {
				x: mouseX - pointerX * newZoom,
				y: mouseY - pointerY * newZoom,
				zoom: newZoom,
			};
		});
	};

	const handleZoomButtons = (deltaZoom: number) => {
		setTransform((prev) => {
			const newZoom = Math.min(Math.max(0.1, prev.zoom + deltaZoom), 3);
			const mouseX = window.innerWidth / 2;
			const mouseY = window.innerHeight / 2;

			const pointerX = (mouseX - prev.x) / prev.zoom;
			const pointerY = (mouseY - prev.y) / prev.zoom;

			return {
				x: mouseX - pointerX * newZoom,
				y: mouseY - pointerY * newZoom,
				zoom: newZoom,
			};
		});
	};

	// --- Handlers for Node Dragging ---
	const handleNodeMouseDown = (e: ReactMouseEvent, model: DataModel) => {
		e.stopPropagation();
		setDraggingNodeId(model.id);
		startDragRef.current = {
			mouseX: e.clientX,
			mouseY: e.clientY,
			nodeX: model.x,
			nodeY: model.y,
		};
	};

	// --- Handlers for Connections ---
	const handleStartConnection = (
		modelId: string,
		fieldId: string,
		e: ReactMouseEvent,
		side: "left" | "right",
	) => {
		e.stopPropagation();
		const el = document.getElementById(`field-${modelId}-${fieldId}`);
		const model = models.find((m) => m.id === modelId);
		if (!el || !model) return;

		// Calculate precise start point
		const relY = el.offsetTop + el.offsetHeight / 2;
		const startX = side === "left" ? model.x : model.x + 200;
		const startY = model.y + relY;

		setDrawingConnection({
			sourceModelId: modelId,
			sourceFieldId: fieldId,
			sourceSide: side,
			startX,
			startY,
			currentX: startX,
			currentY: startY,
		});
	};

	const handleDropConnection = (
		targetModelId: string,
		targetFieldId: string,
		targetSide: "left" | "right",
	) => {
		if (drawingConnection) {
			const dx = drawingConnection.currentX - drawingConnection.startX;
			const dy = drawingConnection.currentY - drawingConnection.startY;
			if (dx * dx + dy * dy < 25) {
				setDrawingConnection(null);
				return;
			}
			// We allow connecting to the exact same field, so no block check here.
			const newConnection: Connection = {
				id: `conn_${Date.now()}`,
				sourceModelId: drawingConnection.sourceModelId,
				sourceFieldId: drawingConnection.sourceFieldId,
				targetModelId,
				targetFieldId,
				sourceSide: drawingConnection.sourceSide,
				targetSide,
			};
			// Prevent duplicate identical connections
			if (
				!connections.some(
					(c) =>
						c.sourceModelId === newConnection.sourceModelId &&
						c.sourceFieldId === newConnection.sourceFieldId &&
						c.targetModelId === newConnection.targetModelId &&
						c.targetFieldId === newConnection.targetFieldId,
				)
			) {
				setConnections((prev) => [...prev, newConnection]);
			}
			setDrawingConnection(null);
		}
	};

	const deleteConnection = (connectionId: string) => {
		setConnections((prev) => prev.filter((c) => c.id !== connectionId));
	};

	// --- Model Management ---
	const saveModel = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const name = formData.get("name") as string;

		if (editingModel?.id) {
			setModels((prev) =>
				prev.map((m) => (m.id === editingModel.id ? { ...m, name } : m)),
			);
		} else {
			const newModel: DataModel = {
				id: "m_" + Date.now(),
				name,
				fields: [],
				x: (-transform.x + window.innerWidth / 2) / transform.zoom - 150,
				y: (-transform.y + window.innerHeight / 2) / transform.zoom - 100,
			};
			setModels((prev) => [...prev, newModel]);
		}
		setIsModelDialogOpen(false);
	};

	const deleteModel = (id: string) => {
		setModels((prev) => prev.filter((m) => m.id !== id));
	};

	// --- Field Management ---
	const saveInlineField = (
		modelId: string,
		fieldId: string,
		name: string,
		type: FieldType,
	) => {
		setModels((prev) =>
			prev.map((m) => {
				if (m.id !== modelId) return m;
				let newFields = [...m.fields];
				if (fieldId !== "NEW") {
					newFields = newFields.map((f) =>
						f.id === fieldId ? { ...f, name, type } : f,
					);
				} else {
					newFields.push({ id: "f_" + Date.now(), name, type });
				}
				return { ...m, fields: newFields };
			}),
		);
		setInlineEditingField(null);
	};

	const deleteField = (modelId: string, fieldId: string) => {
		setModels((prev) =>
			prev.map((m) => {
				if (m.id !== modelId) return m;
				return { ...m, fields: m.fields.filter((f) => f.id !== fieldId) };
			}),
		);
		// Also remove any connections linked to this field
		setConnections((prev) =>
			prev.filter(
				(c) =>
					!(c.sourceModelId === modelId && c.sourceFieldId === fieldId) &&
					!(c.targetModelId === modelId && c.targetFieldId === fieldId),
			),
		);
	};

	// Custom Styles inline for Material 3 specific constraints
	const colors = {
		surfaceContainer: "var(--md-sys-color-surface-container, #f4f4f4)",
		surfaceContainerHigh: "var(--md-sys-color-surface-container-high, #eaeaea)",
		primary: "var(--md-sys-color-primary, #000000)",
		onPrimary: "var(--md-sys-color-on-primary, #ffffff)",
		surface: "var(--md-sys-color-surface, #fdfdfd)",
		onSurface: "var(--md-sys-color-on-surface, #111111)",
		outline: "var(--md-sys-color-outline, #757575)",
	};

	return (
		<div
			style={{
				height: "100vh",
				width: "100vw",
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
				backgroundColor: colors.surfaceContainer,
			}}
		>
			{/* Top App Bar */}
			<header
				style={{
					height: "64px",
					backgroundColor: colors.surface,
					display: "flex",
					alignItems: "center",
					padding: "0 24px",
					justifyContent: "space-between",
					borderBottom: `1px solid ${colors.surfaceContainerHigh}`,
					zIndex: 100,
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
					<span
						className="material-symbols-rounded"
						style={{ color: colors.primary, fontSize: "28px" }}
					>
						schema
					</span>
					<h1 className="title-large" style={{ margin: 0, fontWeight: 700 }}>
						Data Studio
					</h1>
				</div>
			</header>

			{/* Main Workspace */}
			<main
				style={{
					flex: 1,
					position: "relative",
					overflow: "hidden",
				}}
			>

					<div
						style={{
							width: "100%",
							height: "100%",
							cursor: isPanning ? "grabbing" : "grab",
							backgroundImage:
								"radial-gradient(circle at 0 0, var(--md-sys-color-outline) 1.5px, transparent 0)",
							backgroundSize: `${10 * transform.zoom}px ${10 * transform.zoom}px`,
							backgroundPosition: `${transform.x}px ${transform.y}px`,
							opacity: 0.7,
							position: "absolute",
							top: 0,
							left: 0,
						}}
						onMouseDown={handleCanvasMouseDown}
						onMouseMove={handleCanvasMouseMove}
						onMouseUp={handleCanvasMouseUp}
						onMouseLeave={handleCanvasMouseUp}
						onWheel={handleWheel}
					>
						<div
							style={{
								transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
								transformOrigin: "0 0",
								position: "absolute",
								top: 0,
								left: 0,
								width: "100%",
								height: "100%",
							}}
						>
							<ConnectionsLayer
								models={models}
								connections={connections}
								drawingConnection={drawingConnection}
								hoveredTarget={hoveredTarget}
								colors={colors}
								onDeleteConnection={deleteConnection}
							/>
							{models.map((model) => (
								<ModelNode
									key={model.id}
									model={model}
									colors={colors}
									onMouseDown={(e: ReactMouseEvent) =>
										handleNodeMouseDown(e, model)
									}
									onEdit={() => {
										setEditingModel(model);
										setIsModelDialogOpen(true);
									}}
									onDelete={() => deleteModel(model.id)}
									inlineEditingField={
										inlineEditingField?.modelId === model.id
											? inlineEditingField.fieldId
											: null
									}
									onStartInlineEdit={(fieldId: string) =>
										setInlineEditingField({ modelId: model.id, fieldId })
									}
									onSaveInlineField={(
										fieldId: string,
										name: string,
										type: FieldType,
									) => saveInlineField(model.id, fieldId, name, type)}
									onCancelInlineEdit={() => setInlineEditingField(null)}
									onDeleteField={(fieldId: string) =>
										deleteField(model.id, fieldId)
									}
									onStartConnection={handleStartConnection}
									onDropConnection={handleDropConnection}
									isDrawing={
										!!drawingConnection &&
										Math.pow(drawingConnection.currentX - drawingConnection.startX, 2) +
											Math.pow(drawingConnection.currentY - drawingConnection.startY, 2) >=
											25
									}
									setHoveredTarget={setHoveredTarget}
								/>
							))}
						</div>
					</div>

				{/* Zoom Controls */}
				<div
						style={{
							position: "absolute",
							bottom: "40px",
							left: "40px",
							backgroundColor: colors.surface,
							borderRadius: "100px",
							boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
							display: "flex",
							alignItems: "center",
							padding: "6px",
							zIndex: 10,
							border: `1px solid rgba(0,0,0,0.05)`,
						}}
					>
						<button
							onClick={() => handleZoomButtons(-0.2)}
							style={iconBtnStyle}
						>
							<span className="material-symbols-rounded">remove</span>
						</button>
						<span
							style={{
								padding: "0 16px",
								fontSize: "15px",
								fontWeight: 600,
								minWidth: "70px",
								textAlign: "center",
								userSelect: "none",
							}}
						>
							{Math.round(transform.zoom * 100)}%
						</span>
						<button onClick={() => handleZoomButtons(0.2)} style={iconBtnStyle}>
							<span className="material-symbols-rounded">add</span>
						</button>
					</div>

				{/* FAB */}
				<button
					onClick={() => {
						setEditingModel(null);
						setIsModelDialogOpen(true);
					}}
					style={{
						position: "absolute",
						bottom: "40px",
						right: "40px",
						width: "72px",
						height: "72px",
						borderRadius: "24px",
						backgroundColor: colors.primary,
						color: colors.onPrimary,
						border: "none",
						boxShadow: "0 16px 32px rgba(0,0,0,0.2)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						cursor: "pointer",
						transition: "transform 0.3s cubic-bezier(0.2, 0, 0, 1)",
						zIndex: 10,
					}}
					onMouseOver={(e) =>
						(e.currentTarget.style.transform = "scale(1.05) translateY(-4px)")
					}
					onMouseOut={(e) =>
						(e.currentTarget.style.transform = "scale(1) translateY(0)")
					}
				>
					<span
						className="material-symbols-rounded"
						style={{ fontSize: "32px" }}
					>
						add
					</span>
				</button>
			</main>

			{/* Model Dialog */}
			{isModelDialogOpen && (
				<DialogOverlay onClose={() => setIsModelDialogOpen(false)}>
					<form
						onSubmit={saveModel}
						style={{
							backgroundColor: colors.surface,
							padding: "40px",
							borderRadius: "40px",
							width: "480px",
							maxWidth: "90vw",
							boxShadow: "0 24px 64px rgba(0,0,0,0.1)",
						}}
					>
						<h2
							className="display-small"
							style={{ margin: "0 0 32px 0", fontSize: "32px" }}
						>
							{editingModel ? "Edit Model" : "New Model"}
						</h2>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "12px",
								marginBottom: "40px",
							}}
						>
							<label
								style={{
									fontSize: "14px",
									fontWeight: 600,
									color: colors.outline,
									textTransform: "uppercase",
									letterSpacing: "0.05em",
								}}
							>
								Model Name
							</label>
							<input
								name="name"
								defaultValue={editingModel?.name || ""}
								autoFocus
								required
								placeholder="e.g. User, Product"
								style={{
									padding: "20px",
									borderRadius: "20px",
									border: `2px solid ${colors.surfaceContainerHigh}`,
									fontSize: "18px",
									outline: "none",
									transition: "border-color 0.2s",
									backgroundColor: colors.surfaceContainer,
								}}
								onFocus={(e) => (e.target.style.borderColor = colors.primary)}
								onBlur={(e) =>
									(e.target.style.borderColor = colors.surfaceContainerHigh)
								}
							/>
						</div>
						<div
							style={{
								display: "flex",
								justifyContent: "flex-end",
								gap: "16px",
							}}
						>
							<button
								type="button"
								onClick={() => setIsModelDialogOpen(false)}
								style={textBtnStyle}
							>
								Cancel
							</button>
							<button type="submit" style={filledBtnStyle}>
								Save Model
							</button>
						</div>
					</form>
				</DialogOverlay>
			)}
		</div>
	);
}

// --- Subcomponents ---

function InlineFieldEditor({
	initialName = "",
	initialType = "String",
	onSave,
	onCancel,
	colors,
	isLast,
}: any) {
	const [name, setName] = useState(initialName);
	const [type, setType] = useState(initialType);

	return (
		<div
			style={{
				display: "flex",
				gap: "4px",
				padding: "8px 12px",
				borderBottom: isLast
					? "none"
					: `1px solid ${colors.surfaceContainerHigh}`,
				alignItems: "center",
			}}
		>
			<input
				autoFocus
				value={name}
				onChange={(e) => setName(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter" && name) onSave(name, type as FieldType);
					if (e.key === "Escape") onCancel();
				}}
				onMouseDown={(e) => e.stopPropagation()} // Prevent node drag when clicking input
				placeholder="Field name"
				style={{
					flex: 1,
					minWidth: 0,
					padding: "4px 6px",
					borderRadius: "4px",
					border: `1px solid ${colors.outline}`,
					fontSize: "12px",
					outline: "none",
				}}
			/>
			<select
				value={type}
				onChange={(e) => setType(e.target.value)}
				onMouseDown={(e) => e.stopPropagation()}
				style={{
					padding: "4px 6px",
					borderRadius: "4px",
					border: `1px solid ${colors.outline}`,
					fontSize: "12px",
					outline: "none",
					backgroundColor: colors.surface,
					maxWidth: "80px",
				}}
			>
				<option value="String">String</option>
				<option value="Number">Number</option>
				<option value="Boolean">Boolean</option>
				<option value="Date">Date</option>

			</select>
			<div style={{ display: "flex", gap: "2px" }}>
				<button
					onClick={() => {
						if (name) onSave(name, type as FieldType);
					}}
					style={{
						...iconBtnStyleSm,
						color: colors.primary,
						width: "24px",
						height: "24px",
					}}
				>
					<span
						className="material-symbols-rounded"
						style={{ fontSize: "14px" }}
					>
						check
					</span>
				</button>
				<button
					onClick={onCancel}
					style={{
						...iconBtnStyleSm,
						color: "#d32f2f",
						width: "24px",
						height: "24px",
					}}
				>
					<span
						className="material-symbols-rounded"
						style={{ fontSize: "14px" }}
					>
						close
					</span>
				</button>
			</div>
		</div>
	);
}

function roundedPath(points: { x: number; y: number }[], r: number) {
	if (points.length < 2) return "";
	let d = `M ${points[0].x} ${points[0].y}`;
	for (let i = 1; i < points.length - 1; i++) {
		const prev = points[i - 1];
		const curr = points[i];
		const next = points[i + 1];

		const dx1 = curr.x - prev.x;
		const dy1 = curr.y - prev.y;
		const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

		const dx2 = next.x - curr.x;
		const dy2 = next.y - curr.y;
		const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

		const rAct = Math.min(r, len1 / 2, len2 / 2);

		if (rAct === 0) {
			d += ` L ${curr.x} ${curr.y}`;
			continue;
		}

		const ux1 = dx1 / len1;
		const uy1 = dy1 / len1;
		const p1 = { x: curr.x - ux1 * rAct, y: curr.y - uy1 * rAct };

		const ux2 = dx2 / len2;
		const uy2 = dy2 / len2;
		const p2 = { x: curr.x + ux2 * rAct, y: curr.y + uy2 * rAct };

		d += ` L ${p1.x} ${p1.y} Q ${curr.x} ${curr.y} ${p2.x} ${p2.y}`;
	}
	d += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
	return d;
}

function ConnectionsLayer({
	models,
	connections,
	drawingConnection,
	hoveredTarget,
	colors,
	onDeleteConnection,
}: any) {
	const [, setTick] = useState(0);

	// Force re-render to ensure lines sync with DOM layout changes
	React.useEffect(() => {
		setTick((t) => t + 1);
	}, [models, connections]);

	return (
		<svg
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				pointerEvents: "none",
				overflow: "visible",
				zIndex: 50,
			}}
		>
			{connections.map((conn: Connection) => {
				const sourceModel = models.find(
					(m: DataModel) => m.id === conn.sourceModelId,
				);
				const targetModel = models.find(
					(m: DataModel) => m.id === conn.targetModelId,
				);
				if (!sourceModel || !targetModel) return null;

				const sourceEl = document.getElementById(
					`field-${conn.sourceModelId}-${conn.sourceFieldId}`,
				);
				const targetEl = document.getElementById(
					`field-${conn.targetModelId}-${conn.targetFieldId}`,
				);
				if (!sourceEl || !targetEl) return null;

				const sourceRelY = sourceEl.offsetTop + sourceEl.offsetHeight / 2;
				const targetRelY = targetEl.offsetTop + targetEl.offsetHeight / 2;

				const startX =
					conn.sourceSide === "left" ? sourceModel.x : sourceModel.x + 200;
				const startY = sourceModel.y + sourceRelY;
				const endX =
					conn.targetSide === "left" ? targetModel.x : targetModel.x + 200;
				const endY = targetModel.y + targetRelY;

				const sourceHeight =
					document.getElementById(`model-${sourceModel.id}`)?.offsetHeight ||
					200;
				const targetHeight =
					document.getElementById(`model-${targetModel.id}`)?.offsetHeight ||
					200;

				const sourceRect = {
					top: sourceModel.y,
					bottom: sourceModel.y + sourceHeight,
					left: sourceModel.x,
					right: sourceModel.x + 200,
				};

				const targetRect = {
					top: targetModel.y,
					bottom: targetModel.y + targetHeight,
					left: targetModel.x,
					right: targetModel.x + 200,
				};

				const gap = 32;
				const p1X = startX + (conn.sourceSide === "left" ? -gap : gap);
				const p2X = endX + (conn.targetSide === "left" ? -gap : gap);

				let points = [{ x: startX, y: startY }];

				if (conn.sourceSide === "right" && conn.targetSide === "left") {
					if (p1X <= p2X) {
						const midX = (p1X + p2X) / 2;
						points.push({ x: midX, y: startY }, { x: midX, y: endY });
					} else {
						let routeY = 0;
						if (sourceRect.bottom + gap < targetRect.top) {
							routeY = (sourceRect.bottom + targetRect.top) / 2;
						} else if (targetRect.bottom + gap < sourceRect.top) {
							routeY = (targetRect.bottom + sourceRect.top) / 2;
						} else {
							routeY = Math.min(sourceRect.top, targetRect.top) - gap;
						}
						points.push(
							{ x: p1X, y: startY },
							{ x: p1X, y: routeY },
							{ x: p2X, y: routeY },
							{ x: p2X, y: endY },
						);
					}
				} else if (conn.sourceSide === "right" && conn.targetSide === "right") {
					const maxX = Math.max(p1X, p2X);
					points.push({ x: maxX, y: startY }, { x: maxX, y: endY });
				} else if (conn.sourceSide === "left" && conn.targetSide === "left") {
					const minX = Math.min(p1X, p2X);
					points.push({ x: minX, y: startY }, { x: minX, y: endY });
				} else {
					if (p1X >= p2X) {
						const midX = (p1X + p2X) / 2;
						points.push({ x: midX, y: startY }, { x: midX, y: endY });
					} else {
						let routeY = 0;
						if (sourceRect.bottom + gap < targetRect.top) {
							routeY = (sourceRect.bottom + targetRect.top) / 2;
						} else if (targetRect.bottom + gap < sourceRect.top) {
							routeY = (targetRect.bottom + sourceRect.top) / 2;
						} else {
							routeY = Math.min(sourceRect.top, targetRect.top) - gap;
						}
						points.push(
							{ x: p1X, y: startY },
							{ x: p1X, y: routeY },
							{ x: p2X, y: routeY },
							{ x: p2X, y: endY },
						);
					}
				}

				points.push({ x: endX, y: endY });
				let d = roundedPath(points, 16);

				let buttonX = 0;
				let buttonY = 0;
				if (points.length === 4) {
					buttonX = points[1].x;
					buttonY = (points[1].y + points[2].y) / 2;
				} else if (points.length === 6) {
					buttonX = (points[2].x + points[3].x) / 2;
					buttonY = points[2].y;
				}

				return (
					<g key={conn.id} style={{ pointerEvents: "stroke" }}>
						{/* Invisible thicker path for easier hovering/clicking */}
						<path
							d={d}
							fill="none"
							stroke="transparent"
							strokeWidth="16"
							style={{ cursor: "pointer", pointerEvents: "auto" }}
						/>
						<path
							d={d}
							fill="none"
							stroke={colors.primary}
							strokeWidth="2.5"
							opacity="0.5"
						/>
						{/* Delete button dot */}
						<circle
							cx={buttonX}
							cy={buttonY}
							r="8"
							fill={colors.surfaceContainerHigh}
							stroke={colors.outline}
							strokeWidth="2"
							style={{ cursor: "pointer", pointerEvents: "auto" }}
							onClick={(e) => {
								e.stopPropagation();
								onDeleteConnection(conn.id);
							}}
						/>
						<text
							x={buttonX}
							y={buttonY + 3}
							fontSize="10"
							textAnchor="middle"
							fill={colors.outline}
							style={{ pointerEvents: "none" }}
						>
							×
						</text>
					</g>
				);
			})}

			{drawingConnection &&
				(() => {
					const startX = drawingConnection.startX;
					const startY = drawingConnection.startY;

					let endX = drawingConnection.currentX;
					let endY = drawingConnection.currentY;

					if (Math.abs(endX - startX) < 5 && Math.abs(endY - startY) < 5) {
						return null;
					}

					const isValidTarget = !!hoveredTarget;

					// Snap to target if hovering a valid field
					if (isValidTarget) {
						const targetEl = document.getElementById(
							`field-${hoveredTarget.modelId}-${hoveredTarget.fieldId}`,
						);
						const targetModel = models.find(
							(m: DataModel) => m.id === hoveredTarget.modelId,
						);
						if (targetEl && targetModel) {
							endX = targetModel.x;
							endY =
								targetModel.y + targetEl.offsetTop + targetEl.offsetHeight / 2;
						}
					}

					const sourceModel = models.find(
						(m: DataModel) => m.id === drawingConnection.sourceModelId,
					);
					const targetModel = isValidTarget
						? models.find((m: DataModel) => m.id === hoveredTarget.modelId)
						: null;

					const sourceHeight = sourceModel
						? document.getElementById(`model-${sourceModel.id}`)
								?.offsetHeight || 200
						: 200;
					const targetHeight = targetModel
						? document.getElementById(`model-${targetModel.id}`)
								?.offsetHeight || 200
						: 200;

					const sourceRect = {
						top: sourceModel ? sourceModel.y : 0,
						bottom: sourceModel ? sourceModel.y + sourceHeight : 0,
						left: sourceModel ? sourceModel.x : 0,
						right: sourceModel ? sourceModel.x + 200 : 0,
					};

					const targetRect = {
						top: targetModel ? targetModel.y : 0,
						bottom: targetModel ? targetModel.y + targetHeight : 0,
						left: targetModel ? targetModel.x : 0,
						right: targetModel ? targetModel.x + 200 : 0,
					};

					const gap = 32;
					// drawing connection is always right to left in standard
					const sourceSide = drawingConnection.sourceSide || "right";
					const targetSide = hoveredTarget ? "left" : "left";

					const p1X = startX + (sourceSide === "left" ? -gap : gap);
					const p2X = endX + (targetSide === "left" ? -gap : gap);

					let points = [{ x: startX, y: startY }];

					if (sourceSide === "right" && targetSide === "left") {
						if (p1X <= p2X) {
							const midX = (p1X + p2X) / 2;
							points.push({ x: midX, y: startY }, { x: midX, y: endY });
						} else {
							let routeY = 0;
							if (targetModel) {
								if (sourceRect.bottom + gap < targetRect.top) {
									routeY = (sourceRect.bottom + targetRect.top) / 2;
								} else if (targetRect.bottom + gap < sourceRect.top) {
									routeY = (targetRect.bottom + sourceRect.top) / 2;
								} else {
									routeY = Math.min(sourceRect.top, targetRect.top) - gap;
								}
							} else {
								routeY = startY > endY ? endY - gap : endY + gap;
							}
							points.push(
								{ x: p1X, y: startY },
								{ x: p1X, y: routeY },
								{ x: p2X, y: routeY },
								{ x: p2X, y: endY },
							);
						}
					} else {
						// fallback for other side combinations during drawing
						if (p1X <= p2X) {
							const midX = (p1X + p2X) / 2;
							points.push({ x: midX, y: startY }, { x: midX, y: endY });
						} else {
							points.push(
								{ x: p1X, y: startY },
								{ x: p1X, y: (startY + endY) / 2 },
								{ x: p2X, y: (startY + endY) / 2 },
								{ x: p2X, y: endY },
							);
						}
					}

					points.push({ x: endX, y: endY });
					let d = roundedPath(points, 16);

					return (
						<path
							d={d}
							fill="none"
							stroke={colors.primary}
							strokeWidth="3"
							strokeDasharray="6,6"
							opacity="0.6"
						/>
					);
				})()}
		</svg>
	);
}

function ModelNode({
	model,
	colors,
	onMouseDown,
	onEdit,
	onDelete,
	inlineEditingField,
	onStartInlineEdit,
	onSaveInlineField,
	onCancelInlineEdit,
	onDeleteField,
	onStartConnection,
	onDropConnection,
	isDrawing,
	setHoveredTarget,
}: any) {
	const [hoveredField, setHoveredField] = useState<string | null>(null);

	return (
		<div
			id={`model-${model.id}`}
			className="model-node"
			style={{
				position: "absolute",
				left: model.x,
				top: model.y,
				width: "200px",
				backgroundColor: colors.surface,
				borderRadius: "16px",
				border: `1px solid rgba(0,0,0,0.08)`,
				boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
				userSelect: "none",
				display: "flex",
				flexDirection: "column",
				transition: "box-shadow 0.2s",
				zIndex: 1,
			}}
		>
			<div
				onMouseDown={onMouseDown}
				style={{
					padding: "8px 12px",
					backgroundColor: "rgba(0,0,0,0.02)",
					cursor: "grab",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					borderBottom: `1px solid ${colors.surfaceContainerHigh}`,
					borderTopLeftRadius: "16px",
					borderTopRightRadius: "16px",
				}}
				onMouseOver={(e) =>
					(e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)")
				}
				onMouseOut={(e) =>
					(e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.02)")
				}
			>
				<h3
					className="title-large"
					style={{ margin: 0, fontWeight: 700, fontSize: "14px" }}
				>
					{model.name}
				</h3>
				<div style={{ display: "flex", gap: "4px" }}>
					<button
						onClick={() => onStartInlineEdit("NEW")}
						style={{
							...iconBtnStyleSm,
							padding: "4px",
							width: "26px",
							height: "26px",
							color: colors.primary,
						}}
						title="Add Field"
					>
						<span
							className="material-symbols-rounded"
							style={{ fontSize: "16px" }}
						>
							add
						</span>
					</button>
					<button
						onClick={onEdit}
						style={{
							...iconBtnStyleSm,
							padding: "4px",
							width: "26px",
							height: "26px",
						}}
						title="Edit Model"
					>
						<span
							className="material-symbols-rounded"
							style={{ fontSize: "16px" }}
						>
							edit
						</span>
					</button>
					<button
						onClick={onDelete}
						style={{
							...iconBtnStyleSm,
							padding: "4px",
							width: "26px",
							height: "26px",
							color: "#d32f2f",
						}}
						title="Delete Model"
					>
						<span
							className="material-symbols-rounded"
							style={{ fontSize: "16px" }}
						>
							delete
						</span>
					</button>
				</div>
			</div>

			<div
				style={{
					padding: "8px 0 0 0",
					display: "flex",
					flexDirection: "column",
				}}
			>
				{model.fields.map((field: Field, index: number) => {
					const isLastField =
						index === model.fields.length - 1 && inlineEditingField !== "NEW";
					return inlineEditingField === field.id ? (
						<InlineFieldEditor
							key={field.id}
							initialName={field.name}
							initialType={field.type}
							colors={colors}
							onSave={(n: string, t: FieldType) =>
								onSaveInlineField(field.id, n, t)
							}
							onCancel={onCancelInlineEdit}
							isLast={isLastField}
						/>
					) : (
						<div
							id={`field-${model.id}-${field.id}`}
							key={field.id}
							onMouseEnter={() => {
								setHoveredField(field.id);
								if (setHoveredTarget)
									setHoveredTarget({ modelId: model.id, fieldId: field.id });
							}}
							onMouseLeave={() => {
								setHoveredField(null);
								if (setHoveredTarget) setHoveredTarget(null);
							}}
							onMouseUp={(e) => {
								if (isDrawing) {
									e.stopPropagation();
									onDropConnection(model.id, field.id, "left");
								}
							}}
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								padding: "8px 12px",
								borderBottom: isLastField
									? "none"
									: `1px solid ${colors.surfaceContainerHigh}`,
								position: "relative",
							}}
						>
							{/* Left Connection Handle */}
							{isDrawing && hoveredField === field.id && (
								<div
									className="connection-handle"
									style={{
										position: "absolute",
										left: "-6px",
										width: "12px",
										height: "12px",
										borderRadius: "50%",
										backgroundColor: colors.primary,
										border: `2px solid ${colors.surface}`,
									}}
								/>
							)}

							<div
								style={{ display: "flex", alignItems: "center", gap: "8px" }}
							>
								<span
									className="material-symbols-rounded"
									style={{ fontSize: "18px", color: colors.outline }}
								>
									{field.type === "String"
										? "text_format"
										: field.type === "Number"
											? "numbers"
											: field.type === "Boolean"
												? "toggle_on"
												: field.type === "Date"
													? "calendar_today"
													: "link"}
								</span>
								<span style={{ fontSize: "13px", fontWeight: 500 }}>
									{field.name}
								</span>
							</div>
							<div
								style={{ display: "flex", alignItems: "center", gap: "4px" }}
							>
								<span
									style={{
										fontSize: "10px",
										padding: "3px 6px",
										borderRadius: "4px",
										backgroundColor: colors.surfaceContainer,
										color: colors.outline,
										fontWeight: 600,
									}}
								>
									{field.type}
								</span>
								<button
									onClick={() => onStartInlineEdit(field.id)}
									style={{
										...iconBtnStyleSm,
										padding: "4px",
										width: "24px",
										height: "24px",
									}}
								>
									<span
										className="material-symbols-rounded"
										style={{ fontSize: "14px" }}
									>
										edit
									</span>
								</button>
								<button
									onClick={() => onDeleteField(field.id)}
									style={{
										...iconBtnStyleSm,
										padding: "4px",
										width: "24px",
										height: "24px",
										color: "#d32f2f",
									}}
								>
									<span
										className="material-symbols-rounded"
										style={{ fontSize: "14px" }}
									>
										close
									</span>
								</button>
							</div>

							{/* Right Connection Handle */}
							{!isDrawing && hoveredField === field.id && (
								<div
									className="connection-handle"
									onMouseDown={(e) => {
										e.stopPropagation();
										onStartConnection(model.id, field.id, e, "right");
									}}
									style={{
										position: "absolute",
										right: "-6px",
										width: "12px",
										height: "12px",
										borderRadius: "50%",
										backgroundColor: colors.primary,
										cursor: "crosshair",
										border: `2px solid ${colors.surface}`,
									}}
								/>
							)}
						</div>
					);
				})}
				{inlineEditingField === "NEW" && (
					<InlineFieldEditor
						initialName=""
						initialType="String"
						colors={colors}
						onSave={(n: string, t: FieldType) => onSaveInlineField("NEW", n, t)}
						onCancel={onCancelInlineEdit}
						isLast={true}
					/>
				)}
			</div>
		</div>
	);
}

function DialogOverlay({ children, onClose }: any) {
	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: "rgba(0,0,0,0.2)",
				backdropFilter: "blur(12px)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 1000,
				animation: "fadeIn 0.2s ease-out",
			}}
			onMouseDown={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			{children}
			<style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
		</div>
	);
}

// --- Shared Styles ---

const iconBtnStyle = {
	background: "transparent",
	border: "none",
	color: "var(--md-sys-color-on-surface, #111)",
	cursor: "pointer",
	padding: "12px",
	borderRadius: "50%",
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	transition: "background-color 0.2s",
};

const iconBtnStyleSm = {
	...iconBtnStyle,
	padding: "8px",
	width: "36px",
	height: "36px",
};

const filledBtnStyle = {
	backgroundColor: "var(--md-sys-color-primary, #000)",
	color: "var(--md-sys-color-on-primary, #fff)",
	border: "none",
	padding: "14px 32px",
	borderRadius: "100px",
	fontSize: "15px",
	fontWeight: 600,
	cursor: "pointer",
	transition: "transform 0.2s",
	boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const textBtnStyle = {
	backgroundColor: "transparent",
	color: "var(--md-sys-color-primary, #000)",
	border: "none",
	padding: "14px 24px",
	borderRadius: "100px",
	fontSize: "15px",
	fontWeight: 600,
	cursor: "pointer",
	transition: "background-color 0.2s",
};
