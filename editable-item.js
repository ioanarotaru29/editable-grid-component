import {LitElement, html} from "lit";

export class EditableItem extends LitElement {
    static get properties() {
        return {
            index: {type: Number},
            originalIndex: {type: Number},
            currentIndex: {type: Number},
        }
    }

    firstUpdated() {
        this.setAttribute('draggable', 'true')
        const events = ['dragstart', 'dragover', 'dragend']
        events.map(e => this.addEventListener(e, ev => this[e](ev), false))
    }

    trigger(event, detail) {
        this.dispatchEvent(new CustomEvent(event, {
            detail,
            bubbles: true,
            composed: true
        }))
    }

    dragstart() {
        this.trigger("setSource", {index: this.index})
    }

    dragover(event) {
        const index = event.target.closest("editable-item").index
        if(index !== undefined)
            this.trigger("setTarget", {index: index})
    }

    dragend() {
        this.trigger("setCompleted")
    }

    render() {
        return html `
            <slot></slot>
        `;
    }
}

window.customElements.define('editable-item', EditableItem)