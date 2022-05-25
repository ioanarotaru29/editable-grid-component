import {LitElement, html, css} from "lit";

export class EditableItem extends LitElement {
    static get properties() {
        return {
            index: {type: Number},
            originalIndex: {type: Number},
            currentIndex: {type: Number},
            sourceIndex: {type: Number},
            dragEnable: {type: Boolean}
        }
    }

    static get styles() {
        const { cssRules } = document.styleSheets[0]
        const globalStyle = css([Object.values(cssRules).map(rule =>
            rule.cssText).join('\n')])
        return [
            globalStyle,
            css`
            :host(*) {
                display: flex;
                align-items: stretch;
            }
            :host(.drag-highlight) {
                box-shadow: 0px 0px 10px 2px #ccc;
            }
      `
        ];
    }

    constructor() {
        super();
        this.dragEnable = false;
    }

    firstUpdated() {
        this.classList.add('col-lg-4')
        const events = ['dragstart', 'dragover', 'dragend', 'sortableChanged']
        events.map(e => this.addEventListener(e, ev => this[e](ev), false))
    }

    updated() {
        if(this.sourceIndex === this.currentIndex)
            this.classList.add('drag-highlight')
        else
            this.classList.remove('drag-highlight')
        this.setAttribute('draggable', this.dragEnable)
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