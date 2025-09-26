package com.eHarshit.Ecom_proj.service;

import com.eHarshit.Ecom_proj.model.Product;
import com.eHarshit.Ecom_proj.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepo repo;

    public Product saveProduct(Product product, MultipartFile imageFile) throws IOException {
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

    public Product updateProduct(int id, Product updatedProduct, MultipartFile imageFile) throws IOException {
        Product product = getProductById(id);
        if (product != null) {
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
        return null;
    }

    public void deleteProduct(int id) {
        repo.deleteById(id);
    }

    public List<Product> searchProducts(String keyword) {
        return repo.searchProducts(keyword);
    }
}
