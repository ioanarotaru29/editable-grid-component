import {LitElement, html} from "lit";

export class EditableItem extends LitElement {
    static get properties() {
        return {
            index: {type: Number},
            originalIndex: {type: Number},
            currentIndex: {type: Number},
        }
    }

    render() {
        return html `
            <slot></slot>
        `;
    }
}

window.customElements.define('editable-item', EditableItem)