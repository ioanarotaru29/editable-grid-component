import {LitElement, html, css} from "lit";

export class EditableItem extends LitElement {
    static get properties() {
        return {
            index: {type: Number},
            originalIndex: {type: Number},
            currentIndex: {type: Number},
            sourceIndex: {type: Number},
            dragEnable: {type: Boolean},

            resizeEnable: {type: Boolean},
            isResizing: {type: Boolean},
            initialX: {type: Number},
            initialWidth: {type: Number},
            currentWidth: {type: Number}
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
                user-select: none;
            }
            :host(.drag-highlight) {
                box-shadow: 0px 0px 10px 2px #ccc;
            }
            .resize-drag {
                padding: 0 5px;
                color: #ccc;
                visibility: hidden;
            }
            
            :host([resizable=true]) .resize-drag {
                visibility: visible;
                display: flex;
                flex-direction: column;
                justify-content: center;
                cursor: e-resize;
            }
      `
        ];
    }

    constructor() {
        super();
        this.dragEnable = false;
        this.resizeEnable = false;
        this.isResizing = false;
    }

    get resizeHandle() {
        return this.renderRoot.querySelector(".resize-drag")
    }

    firstUpdated() {
        this.classList.add('col-lg-4')
        const events = ['dragstart', 'dragover', 'dragend', 'sortableChanged']
        events.map(e => this.addEventListener(e, ev => this[e](ev), false))

        const resizeEvents = [
            {event: "mousedown", handler: "initResize"},
            {event: "mousemove", handler: "doResize"},
            {event: "mouseup", handler: "stopResize"}
        ]
        resizeEvents.map(e => {
            this[e.handler] = this[e.handler].bind(this);
            e.event === "mousemove" ?
                window.addEventListener(e.event, ev => this[e.handler](ev), false)
                : this.resizeHandle.addEventListener(e.event, ev => this[e.handler](ev), false)
        })
    }

    updated() {
        if (this.sourceIndex === this.currentIndex)
            this.classList.add('drag-highlight')
        else
            this.classList.remove('drag-highlight')
        this.setAttribute('draggable', this.dragEnable)
        this.setAttribute('resizable', this.resizeEnable)
    }

    trigger(event, detail) {
        this.dispatchEvent(new CustomEvent(event, {
            detail,
            bubbles: true,
            composed: true
        }))
    }

    initResize(event) {
        this.isResizing = true
        this.initialX = event.clientX
        this.initialWidth = this.currentWidth = this.getBoundingClientRect().width
    }

    doResize(event) {
        if(this.isResizing) {
            const currentWidth = this.initialWidth + (event.clientX - this.initialX)
            const containerWidth = this.parentElement.getBoundingClientRect().width
            const colWidth = containerWidth / 12
            if(Math.abs(Math.round(currentWidth/colWidth)*colWidth - currentWidth) < 25)
                this.currentWidth = Math.round(currentWidth/colWidth)*colWidth
            else
                this.currentWidth = currentWidth
            this.style.minWidth = this.currentWidth + "px"
            this.style.maxWidth = this.currentWidth + "px"
        }
    }

    stopResize(event) {
        this.isResizing = false
        this.initialX = null
        this.initialWidth = null

        const containerWidth = this.parentElement.getBoundingClientRect().width
        const colWidth = containerWidth / 12
        this.style.removeProperty("max-width")
        this.style.removeProperty("min-width")
        this.className = this.className.replace(/col-lg-\d/, `col-lg-${Math.round(this.currentWidth/colWidth)}`)
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
            <div class="resize-drag">
                ||
            </div>
        `;
    }
}

window.customElements.define('editable-item', EditableItem)