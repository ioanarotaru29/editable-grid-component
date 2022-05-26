# editable-grid
Framework Design - Editable Grid Web Component.

The project provides an Editable Grid built as an Web Component. The grid is based on Bootstrap's Grid Layout system and allows the following actions:

* Sorting of the Grid Elements
* Resizing of the Grid Elements

## Usage
### Prerequisites
 * **Bootstrap4** or later
### Instalation
Run

    npm install

The `editable-grid.js` and `editable-item.js` need to be imported in the HTML file.

    <script type="module" src="editable-grid.js"></script>
    <script type="module" src="editable-item.js"></script>
### Use in HTML
The grid is accessible via the `<editable-grid></editable-grid>` tag.

To add elements to the grid, simply wrap each item into a `<editable-item></editable-item>` tag.

The sorting and rezising option can be enabled by adding a `sortable=true` or `resizable=true` attribute to the `<editable-grid>` tag.

### Example
    <editable-grid sortable="true" resizable="true">
        <editable-item>
            <div class="card">
                ...
            </div>
        </editable-item>
        ...
    </editable-grid>
    
![96tRUoGdOo](https://user-images.githubusercontent.com/62284778/170545722-cb321e2f-29fa-465d-aaec-ffd5e07f6c75.gif)
