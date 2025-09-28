package com.eHarshit.Ecom_proj.service;

import com.eHarshit.Ecom_proj.model.Product;
import com.eHarshit.Ecom_proj.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepo repo;

    // Add new product with redundancy check
    public Product saveProduct(Product product, MultipartFile imageFile) throws IOException {
        // Check duplicate by name
        Optional<Product> existing = repo.findByNameIgnoreCase(product.getName());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Product with name '" + product.getName() + "' already exists.");
        }

        // Optional: Check duplicate by name+brand
        if (product.getBrand() != null && repo.findByNameAndBrand(product.getName(), product.getBrand()).isPresent()) {
            throw new IllegalArgumentException("Product '" + product.getName() + "' already exists under brand '" + product.getBrand() + "'");
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            product.setImageName(imageFile.getOriginalFilename());
            product.setImageType(imageFile.getContentType());
            product.setImageData(imageFile.getBytes());
        }
        return repo.save(product);
    }

    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    public Product getProductById(int id) {
        return repo.findById(id).orElse(null);
    }

    // Update with redundancy check
    public Product updateProduct(int id, Product updatedProduct, MultipartFile imageFile) throws IOException {
        Product product = getProductById(id);
        if (product == null) {
            return null;
        }

        // Redundancy check for new name
        Optional<Product> duplicate = repo.findByNameIgnoreCase(updatedProduct.getName());
        if (duplicate.isPresent() && duplicate.get().getId() != id) {
            throw new IllegalArgumentException("Another product with name '" + updatedProduct.getName() + "' already exists.");
        }

        product.setName(updatedProduct.getName());
        product.setDescription(updatedProduct.getDescription());
        product.setBrand(updatedProduct.getBrand());
        product.setPrice(updatedProduct.getPrice());
        product.setCategory(updatedProduct.getCategory());
        product.setReleaseDate(updatedProduct.getReleaseDate());
        product.setProductAvailable(updatedProduct.isProductAvailable());
        product.setStockQuantity(updatedProduct.getStockQuantity());

        if (imageFile != null && !imageFile.isEmpty()) {
            product.setImageName(imageFile.getOriginalFilename());
            product.setImageType(imageFile.getContentType());
            product.setImageData(imageFile.getBytes());
        }
        return repo.save(product);
    }

    public void deleteProduct(int id) {
        if (!repo.existsById(id)) {
            throw new IllegalArgumentException("Product with ID " + id + " does not exist.");
        }
        repo.deleteById(id);
    }

    public List<Product> searchProducts(String keyword) {
        return repo.searchProducts(keyword);
    }
}
