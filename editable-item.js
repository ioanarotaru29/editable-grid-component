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
        console.log('start dragging')
        this.trigger("setSource", {index: this.index})
    }

    dragover(event) {
        console.log('dragged over')
        this.trigger("setTarget", {index: event.target.index})
    }

    dragend() {
        console.log('dragged end')
        this.trigger("setCompleted")
    }

    render() {
        return html `
            <slot></slot>
        `;
    }
}

window.customElements.define('editable-item', EditableItem)