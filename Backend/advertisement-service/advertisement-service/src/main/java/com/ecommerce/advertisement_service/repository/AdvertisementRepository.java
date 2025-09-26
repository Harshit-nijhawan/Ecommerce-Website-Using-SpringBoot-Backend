package com.ecommerce.advertisement_service.repository;

import com.ecommerce.advertisement_service.model.Advertisement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdvertisementRepository extends JpaRepository<Advertisement, Long> {
}
