package com.houserent.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class AppointmentRequest {
    @NotNull(message = "房源ID不能为空")
    private Long houseId;

    @NotNull(message = "看房日期不能为空")
    private LocalDate visitDate;

    @NotBlank(message = "看房时间不能为空")
    private String visitTime;

    private String message;
}
