package com.houserent.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
public class HouseRequest {
    @NotBlank(message = "标题不能为空")
    private String title;

    private String description;

    @NotBlank(message = "省份不能为空")
    private String province;

    @NotBlank(message = "城市不能为空")
    private String city;

    @NotBlank(message = "区县不能为空")
    private String district;

    private String address;

    @NotNull(message = "价格不能为空")
    private BigDecimal price;

    @NotNull(message = "面积不能为空")
    private Integer area;

    @NotNull(message = "卧室数量不能为空")
    private Integer bedroom;

    private Integer livingRoom;
    private Integer bathroom;
    private String orientation;
    private String floor;
    private String decoration;
    private String houseType;
    private String images;
    private String facilities;
}
