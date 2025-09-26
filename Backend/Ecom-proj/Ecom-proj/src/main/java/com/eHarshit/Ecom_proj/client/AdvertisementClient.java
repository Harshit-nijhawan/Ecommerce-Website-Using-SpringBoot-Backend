package com.eHarshit.Ecom_proj.client;

import com.eHarshit.Ecom_proj.dto.AdvertisementDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@FeignClient(name = "advertisement-service")
public interface AdvertisementClient {

    @GetMapping("/ads")
    List<AdvertisementDTO> getAllAds();

    @GetMapping("/ads/{id}")
    AdvertisementDTO getAdById(@PathVariable("id") int id);

    @PostMapping("/ads")
    AdvertisementDTO createAd(@RequestBody AdvertisementDTO ad);

    @PutMapping("/ads/{id}")
    AdvertisementDTO updateAd(@PathVariable("id") int id, @RequestBody AdvertisementDTO ad);

    @DeleteMapping("/ads/{id}")
    boolean deleteAd(@PathVariable("id") int id);
}