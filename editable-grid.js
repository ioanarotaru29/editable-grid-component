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
            ::slotted(*) {
                height: 300px;
            }
      `
        ];
    }

    get gridItems() {
        return [...this.querySelectorAll("editable-item")]
    }

    sort() {
        // const minIndex = Math.min(this.sourceIndex, this.targetIndex)
        // const maxIndex = Math.max(this.sourceIndex, this.targetIndex)
        //
        // const newIndexMapping = item => {
        //     if(item.currentIndex === minIndex)
        //         item.index = maxIndex
        //     else if(item.index > minIndex && item.index <= maxIndex )
        //         item.index -= 1
        //     return item
        // }

        this.gridItems.find(item => item.index == this.targetIndex).index = this.sourceIndex
        this.gridItems.find(item => item.currentIndex == this.sourceIndex).index = this.targetIndex
        const sortIndex = (a, b) => (a.index > b.index) ? 1 : -1
        const reduceIndex = (item, i) => item.index = i
        const unordered = (item, i) => item.index !== i

        this.gridItems.sort(sortIndex).map(reduceIndex)
        if (this.gridItems.filter(unordered).length) {
            this.gridItems.sort(sortIndex).map(e => {
                this.removeChild(e); return e
            }).map(e =>
                this.append(e)
            )
        }
    }

    firstUpdated() {
        this.addEventListener("setSource", event => this.sourceIndex = event.detail.index)
        this.addEventListener("setTarget", event => {
            this.targetIndex = event.detail.index
            this.sort()
        })
        this.addEventListener("setCompleted", () => {
            this.gridItems.map((item, i) =>
                item.currentIndex = i)
        })

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
                <div class="row">
                    <slot></slot>
                </div>                
            </div>
    `;
    }
}
customElements.define('editable-grid', EditableGrid);
