import React, { useState, useEffect, useRef } from "react";
import axios from "../../AxiosInstance";
import { toast } from "react-toastify";
import ProductsTable from "../tables/ProductsTable";
import AddProductModal from "../modals/AddProductModal";
import EditProductModal from "../modals/EditProductModal";
import DeleteProductModal from "../modals/DeleteProductModal";

interface Product {
  product_id: number;
  product_picture: string | null;
  product_name: string;
  price: number;
  quantity: number;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    quantity: "",
    productImage: null as File | null,
  });
  const fileInputRef = useRef<HTMLInputElement>(
    null
  ) as React.RefObject<HTMLInputElement>;
  const [modalLoading, setModalLoading] = useState(false);

  // Load products
  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/loadProducts"
      );
      setProducts(response.data.products);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        productImage: e.target.files![0],
      }));
    }
  };

  // Handle add product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("productName", formData.productName);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("quantity", formData.quantity);
    if (formData.productImage) {
      formDataToSend.append("productImage", formData.productImage);
    }
    try {
      await axios.post(
        "http://localhost:8000/api/storeProduct",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Product added successfully");
      setShowAddModal(false);
      loadProducts();
      resetForm();
    } catch (error) {
      toast.error("Failed to add product");
    } finally {
      setModalLoading(false);
    }
  };

  // Handle edit product
  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setModalLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("_method", "PUT");
    formDataToSend.append("productName", formData.productName);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("quantity", formData.quantity);
    if (formData.productImage instanceof File) {
      formDataToSend.append("productImage", formData.productImage);
    }
    try {
      await axios.post(
        `http://localhost:8000/api/updateProduct/${editingProduct.product_id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Product updated successfully");
      setShowEditModal(false);
      loadProducts();
      resetForm();
    } catch (error) {
      toast.error("Failed to update product");
    } finally {
      setModalLoading(false);
    }
  };

  // Handle delete product
  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    setModalLoading(true);
    try {
      await axios.delete(
        `http://localhost:8000/api/deleteProduct/${deletingProduct.product_id}`
      );
      toast.error("Product deleted successfully");
      setShowDeleteModal(false);
      loadProducts();
      setDeletingProduct(null);
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setModalLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      productName: "",
      price: "",
      quantity: "",
      productImage: null,
    });
    setEditingProduct(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Open modal for editing
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.product_name || "",
      price: product.price?.toString() || "",
      quantity: product.quantity?.toString() || "",
      productImage: null,
    });
    setShowEditModal(true);
  };

  // Open modal for deleting
  const openDeleteModal = (product: Product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  return (
    <div className="p-4">
      <div className="d-flex text-white justify-content-between align-items-center mb-3">
        <h2>Products</h2>
        <button
          className="btn btn-danger"
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          Add Product
        </button>
      </div>
      <ProductsTable
        products={products}
        loading={loading}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />
      <AddProductModal
        show={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        onSubmit={handleAddProduct}
        formData={formData}
        onInputChange={handleInputChange}
        onImageChange={handleImageChange}
        fileInputRef={fileInputRef}
        loading={modalLoading}
      />
      <EditProductModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        onSubmit={handleEditProduct}
        formData={formData}
        onInputChange={handleInputChange}
        onImageChange={handleImageChange}
        fileInputRef={fileInputRef}
        loading={modalLoading}
      />
      <DeleteProductModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingProduct(null);
        }}
        onDelete={handleDeleteProduct}
        productName={deletingProduct?.product_name || ""}
      />
    </div>
  );
};

export default Products;
