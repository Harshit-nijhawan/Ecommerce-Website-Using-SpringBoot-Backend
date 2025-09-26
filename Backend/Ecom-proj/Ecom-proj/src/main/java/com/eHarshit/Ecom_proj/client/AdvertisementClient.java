package com.eHarshit.Ecom_proj.client;

import com.eHarshit.Ecom_proj.dto.AdvertisementDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@FeignClient(name = "advertisement-service")
public interface AdvertisementClient {

    @GetMapping("/ads") // endpoint from advertisement-service
    List<AdvertisementDTO> getAllAds();
}
