import {LitElement, html, css} from 'lit';

export class EditableGrid extends LitElement {
    static get properties () {
        return {
            sourceIndex: {type: Number},
            targetIndex: {type: Number}
        }
    }

    static get styles() {
        const { cssRules } = document.styleSheets[0]
        const globalStyle = css([Object.values(cssRules).map(rule =>
            rule.cssText).join('\n')])
        return [
            globalStyle,
            css`
      `
        ];
    }

    get gridItems() {
        return [...this.querySelectorAll("editable-item")]
    }

    firstUpdated() {
        this.gridItems.map((item, index) => {
            item.index = index
            item.originalIndex = index
            item.currentIndex = index
            return item
        })
    }

    render() {
        return html`
            <div class="container-fluid">
                <slot></slot>
            </div>
    `;
    }
}
customElements.define('editable-grid', EditableGrid);
