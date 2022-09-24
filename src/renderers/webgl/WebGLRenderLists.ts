import { Object3D, BufferGeometry, Material, WebGLProperties } from "../../";

function painterSortStable(a, b) {
	if (a.groupOrder !== b.groupOrder) {
		return a.groupOrder - b.groupOrder;
	} else if (a.renderOrder !== b.renderOrder) {
		return a.renderOrder - b.renderOrder;
	} else if (a.program !== b.program) {
		return a.program.id - b.program.id;
	} else if (a.material.id !== b.material.id) {
		return a.material.id - b.material.id;
	} else if (a.z !== b.z) {
		return a.z - b.z;
	} else {
		return a.id - b.id;
	}
}

function reversePainterSortStable(a, b) {
	if (a.groupOrder !== b.groupOrder) {
		return a.groupOrder - b.groupOrder;
	} else if (a.renderOrder !== b.renderOrder) {
		return a.renderOrder - b.renderOrder;
	} else if (a.z !== b.z) {
		return b.z - a.z;
	} else {
		return a.id - b.id;
	}
}

export interface RenderItem {
	id: number;
	object: Object3D;
	geometry: BufferGeometry;
	material: Material;
	program: any;
	groupOrder: number;
	renderOrder: number;
	z: number;
	group: any;
}

class WebGLRenderList {
	_properties: WebGLProperties;

	renderItems: RenderItem[] = [];
	renderItemsIndex = 0;

	opaque: RenderItem[] = [];
	transparent: RenderItem[] = [];

	defaultProgram = { id: -1 };

	constructor(properties: WebGLProperties) {
		this._properties = properties;
	}

	init() {
		this.renderItemsIndex = 0;
		this.opaque.length = 0;
		this.transparent.length = 0;
	}

	getNextRenderItem(
		object: Object3D,
		geometry: BufferGeometry,
		material: Material,
		groupOrder,
		z,
		group
	): RenderItem {
		let renderItem = this.renderItems[this.renderItemsIndex];
		const materialProperties = this._properties.get(material);

		if (renderItem === undefined) {
			renderItem = {
				id: object.id,
				object: object,
				geometry: geometry,
				material: material,
				program: materialProperties.program || this.defaultProgram,
				groupOrder: groupOrder,
				renderOrder: object.renderOrder,
				z: z,
				group: group,
			};

			this.renderItems[this.renderItemsIndex] = renderItem;
		} else {
			renderItem.id = object.id;
			renderItem.object = object;
			renderItem.geometry = geometry;
			renderItem.material = material;
			renderItem.program = materialProperties.program || this.defaultProgram;
			renderItem.groupOrder = groupOrder;
			renderItem.renderOrder = object.renderOrder;
			renderItem.z = z;
			renderItem.group = group;
		}

		this.renderItemsIndex++;

		return renderItem;
	}

	push(
		object: Object3D,
		geometry: BufferGeometry,
		material: Material,
		groupOrder,
		z,
		group
	) {
		const renderItem = this.getNextRenderItem(
			object,
			geometry,
			material,
			groupOrder,
			z,
			group
		);

		(material.transparent === true ? this.transparent : this.opaque).push(
			renderItem
		);
	}

	unshift(
		object: Object3D,
		geometry: BufferGeometry,
		material: Material,
		groupOrder,
		z,
		group
	) {
		const renderItem = this.getNextRenderItem(
			object,
			geometry,
			material,
			groupOrder,
			z,
			group
		);

		(material.transparent === true ? this.transparent : this.opaque).unshift(
			renderItem
		);
	}

	sort(customOpaqueSort, customTransparentSort) {
		if (this.opaque.length > 1)
			this.opaque.sort(customOpaqueSort || painterSortStable);
		if (this.transparent.length > 1)
			this.transparent.sort(customTransparentSort || reversePainterSortStable);
	}

	finish() {
		// Clear references from inactive renderItems in the list

		for (
			let i = this.renderItemsIndex, il = this.renderItems.length;
			i < il;
			i++
		) {
			const renderItem = this.renderItems[i];

			if (renderItem.id === null) break;

			renderItem.id = null;
			renderItem.object = null;
			renderItem.geometry = null;
			renderItem.material = null;
			renderItem.program = null;
			renderItem.group = null;
		}
	}
}

class WebGLRenderLists {
	_properties: WebGLProperties;

	lists = new WeakMap<Object3D, WebGLRenderList[]>();

	constructor(properties: WebGLProperties) {
		this._properties = properties;
	}

	get(scene: Object3D, renderCallDepth: number): WebGLRenderList {
		let list: WebGLRenderList;

		if (!this.lists.has(scene)) {
			list = new WebGLRenderList(this._properties);
			this.lists.set(scene, [list]);
		} else {
			if (renderCallDepth >= this.lists.get(scene).length) {
				list = new WebGLRenderList(this._properties);
				this.lists.get(scene).push(list);
			} else {
				list = this.lists.get(scene)[renderCallDepth];
			}
		}

		return list;
	}

	dispose() {
		this.lists = new WeakMap();
	}
}

export { WebGLRenderLists, WebGLRenderList };
