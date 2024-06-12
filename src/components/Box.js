import './Box.css'

const Box = () => {
    return ( 
        <div className="container">
            <div className="box">
                <h1>Add New Item</h1>
            </div>
        </div>
     );
}
 
export default Box;


// select * from invoice join item_invoice on item_invoice.invoice_id = invoice.iid 