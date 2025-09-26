//package com.eHarshit.Ecom_proj;
//
//import org.springframework.boot.SpringApplication;
//import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
//import org.springframework.cloud.openfeign.EnableFeignClients;
//
//@SpringBootApplication
//@EnableDiscoveryClient          // Enables Eureka Client
//@EnableFeignClients             // Enables Feign Clients
//public class EcomProjApplication {
//
//	public static void main(String[] args) {
//		SpringApplication.run(EcomProjApplication.class, args);
//	}
//}

package com.eHarshit.Ecom_proj;

import com.eHarshit.Ecom_proj.client.AdvertisementClient;
import com.eHarshit.Ecom_proj.dto.AdvertisementDTO;
import com.eHarshit.Ecom_proj.model.Product;
import com.eHarshit.Ecom_proj.repo.ProductRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

import java.util.List;
import java.util.Scanner;

@SpringBootApplication
@EnableFeignClients
public class EcomProjApplication implements CommandLineRunner {

	private final AdvertisementClient advertisementClient;
	private final ProductRepo productRepo;

	public EcomProjApplication(AdvertisementClient advertisementClient, ProductRepo productRepo) {
		this.advertisementClient = advertisementClient;
		this.productRepo = productRepo;
	}

	public static void main(String[] args) {
		SpringApplication.run(EcomProjApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		Scanner scanner = new Scanner(System.in);
		System.out.println("Welcome to E-Commerce CLI!");

		while (true) {
			System.out.println("\nMenu:");
			System.out.println("1. View Advertisements");
			System.out.println("2. View Products");
			System.out.println("3. Exit");
			System.out.print("Enter your choice: ");
			int choice = scanner.nextInt();
			scanner.nextLine(); // consume newline

			switch (choice) {
				case 1 -> showAdvertisements();
				case 2 -> showProducts();
				case 3 -> {
					System.out.println("Exiting...");
					System.exit(0);
				}
				default -> System.out.println("Invalid choice, try again!");
			}
		}
	}

	private void showAdvertisements() {
		try {
			List<AdvertisementDTO> ads = advertisementClient.getAllAds();
			if (ads.isEmpty()) {
				System.out.println("No advertisements available.");
			} else {
				System.out.println("\nAdvertisements:");
				ads.forEach(ad ->
						System.out.println(ad.getId() + ". " + ad.getTitle() + " - " + ad.getImageUrl())
				);
			}
		} catch (Exception e) {
			System.out.println("Failed to fetch advertisements: " + e.getMessage());
		}
	}

	private void showProducts() {
		List<Product> products = productRepo.findAll();
		if (products.isEmpty()) {
			System.out.println("No products available.");
		} else {
			System.out.println("\nProducts:");
			products.forEach(p ->
					System.out.println(p.getId() + ". " + p.getName() + " - " + p.getDescription() + " - ₹" + p.getPrice())
			);
		}
	}
}
