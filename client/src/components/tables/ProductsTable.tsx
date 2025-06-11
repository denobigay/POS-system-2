import React from "react";

interface Product {
  product_id: number;
  product_picture: string | null;
  product_name: string;
  price: number;
  quantity: number;
}

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  loading,
  onEdit,
  onDelete,
}) => {
  return (
    <table className="table table-dark table-striped table-hover rounded" style={{ borderRadius: '12px', overflow: 'hidden' }}>
      <thead className="align-middle">
        <tr>
          <th>ID</th>
          <th>Image</th>
          <th>Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={6} className="text-center">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </td>
          </tr>
        ) : Array.isArray(products) && products.length > 0 ? (
          products.map((product, index) => (
            <tr key={product.product_id}>
              <td>{index + 1}</td>
              <td>
                {product.product_picture ? (
                  <img
                    className="rounded-circle"
                    src={`http://localhost:8000/${product.product_picture}`}
                    alt={product.product_name}
                    width="40"
                    height="40"
                  />
                ) : (
                  <span className="text-muted">No Image</span>
                )}
              </td>
              <td>{product.product_name}</td>
              <td>₱{Number(product.price).toFixed(2)}</td>
              <td>{product.quantity}</td>
              <td>
                <div className="btn-group">
                  <button
                    className="btn btn-success"
                    onClick={() => onEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => onDelete(product)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="text-center">
              No products found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ProductsTable;
