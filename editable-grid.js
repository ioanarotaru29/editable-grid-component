import {LitElement, html, css} from 'lit';

export class EditableGrid extends LitElement {
    static get properties () {
        return {
            sourceIndex: {type: Number},
            targetIndex: {type: Number},
            sortable: {type: Boolean},
            resizable: {type: Boolean}
        }
    }

    constructor() {
        super();
        this.sortable=false
        this.rezisable=false
    }


    static get styles() {
        const { cssRules } = document.styleSheets[0]
        const globalStyle = css([Object.values(cssRules).map(rule =>
            rule.cssText).join('\n')])
        return [
            globalStyle,
            css`
            ::slotted(*) {
                padding:5px;
                marring: 5px;
            }
            .switch {
              position: relative;
              display: inline-block;
              margin-left: 2.5rem;
              height: 1.5rem;
            } 
            .switch input { 
              opacity: 0;
              width: 0;
              height: 0;
            }
            .slider {
              position: absolute;
              cursor: pointer;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              width: 2.5rem;
              margin-left: -2.5rem;
              background-color: #ccc;
              -webkit-transition: .4s;
              transition: .4s;
            }
            .slider:before {
              position: absolute;
              content: "";
              height: 1rem;
              width: 1rem;
              left: 4px;
              bottom: 4px;
              background-color: white;
              -webkit-transition: .4s;
              transition: .4s;
            }
            input:checked + .slider {
              background-color: steelblue;
            }
            input:focus + .slider {
              box-shadow: 0 0 1px steelblue;
            }
            input:checked + .slider:before {
              -webkit-transform: translateX(1rem);
              -ms-transform: translateX(1rem);
              transform: translateX(1rem);
            }
            .slider.round {
              border-radius: 1.5rem;
            }
            .slider.round:before {
              border-radius: 50%;
            }
      `
        ];
    }

    get gridItems() {
        return [...this.querySelectorAll("editable-item")]
    }

    get sortableSwitch() {
        return this.renderRoot.querySelector("#sortableSwitch")
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
        this.addEventListener("setSource", event => {
            this.sourceIndex = event.detail.index
            this.gridItems.map(item => {
                item.sourceIndex = event.detail.index
            })
        })
        this.addEventListener("setTarget", event => {
            this.targetIndex = event.detail.index
            this.sort()
        })
        this.addEventListener("setCompleted", () => {
            this.gridItems.map((item, i) =>
            {
                item.currentIndex = i
                item.sourceIndex = null
            }
            )
        })
        if(this.sortable)
            this.sortableSwitch.addEventListener("change", event => this.gridItems.map(item => item.dragEnable = event.target.checked))

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
                ${ this.sortable ? 
                    html`
                    <div class="row m-2">
                        <label class="switch">
                          <input type="checkbox" id="sortableSwitch">
                          <span class="slider round"></span>
                          Allow item sorting
                        </label>
                    </div>`
                    : ''
                }
                ${this.resizable ?
                    html`
                    <div class="row m-2">    
                        <label class="switch">
                          <input type="checkbox" id="resizableSwitch">
                          <span class="slider round"></span>
                          Allow item resizing
                        </label>
                    </div>`
                    : ''
                }
                <div class="row">
                    <slot></slot>
                </div>                
            </div>
    `;
    }
}
customElements.define('editable-grid', EditableGrid);
