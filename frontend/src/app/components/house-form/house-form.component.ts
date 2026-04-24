import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HouseService } from '../../services/house.service';
import { House, HouseRequest } from '../../models/house';

@Component({
  selector: 'app-house-form',
  templateUrl: './house-form.component.html',
  styleUrls: ['./house-form.component.scss']
})
export class HouseFormComponent implements OnInit {
  houseForm: FormGroup;
  loading = false;
  submitting = false;
  error = '';
  isEdit = false;
  houseId: number | null = null;

  provinces = ['北京市', '上海市', '广东省', '浙江省', '江苏省', '四川省', '湖北省', '陕西省'];
  cities: { [key: string]: string[] } = {
    '北京市': ['北京'],
    '上海市': ['上海'],
    '广东省': ['广州', '深圳', '东莞', '佛山'],
    '浙江省': ['杭州', '宁波', '温州'],
    '江苏省': ['南京', '苏州', '无锡'],
    '四川省': ['成都', '绵阳'],
    '湖北省': ['武汉', '宜昌'],
    '陕西省': ['西安', '咸阳']
  };
  districts = ['', '朝阳区', '海淀区', '浦东新区', '南山区', '西湖区', '玄武区', '锦江区', '洪山区', '雁塔区'];
  orientations = ['', '朝南', '朝北', '朝东', '朝西', '南北通透'];
  floors = ['', '低楼层', '中楼层', '高楼层', '顶层', '底层'];
  decorations = ['', '毛坯', '简装', '精装', '豪装'];
  houseTypes = ['', '公寓', '住宅', '别墅', '商铺'];
  facilitiesOptions = ['空调', '暖气', '热水器', '洗衣机', '冰箱', '电视', '宽带', '天然气', '车位', '阳台'];

  constructor(
    private formBuilder: FormBuilder,
    private houseService: HouseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.houseForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(2000)],
      province: ['', Validators.required],
      city: ['', Validators.required],
      district: ['', Validators.required],
      address: ['', Validators.maxLength(200)],
      price: [null, [Validators.required, Validators.min(100), Validators.max(100000)]],
      area: [null, [Validators.required, Validators.min(5), Validators.max(1000)]],
      bedroom: [null, [Validators.required, Validators.min(0), Validators.max(20)]],
      livingRoom: [0, [Validators.min(0), Validators.max(10)]],
      bathroom: [1, [Validators.min(0), Validators.max(10)]],
      orientation: [''],
      floor: [''],
      decoration: [''],
      houseType: [''],
      images: [''],
      facilities: [[]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.houseId = +id;
      this.loadHouse(this.houseId);
    }
  }

  loadHouse(id: number): void {
    this.loading = true;
    this.houseService.getHouseById(id).subscribe({
      next: (house) => {
        this.houseForm.patchValue({
          title: house.title,
          description: house.description,
          province: house.province,
          city: house.city,
          district: house.district,
          address: house.address,
          price: house.price,
          area: house.area,
          bedroom: house.bedroom,
          livingRoom: house.livingRoom || 0,
          bathroom: house.bathroom || 1,
          orientation: house.orientation,
          floor: house.floor,
          decoration: house.decoration,
          houseType: house.houseType,
          images: house.images,
          facilities: house.facilities ? house.facilities.split(',') : []
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = '加载失败，请稍后重试';
      }
    });
  }

  onProvinceChange(): void {
    const province = this.houseForm.get('province')?.value;
    if (province) {
      this.houseForm.patchValue({ city: '' });
    }
  }

  getAvailableCities(): string[] {
    const province = this.houseForm.get('province')?.value;
    if (province && this.cities[province]) {
      return this.cities[province];
    }
    return [];
  }

  toggleFacility(facility: string): void {
    const currentFacilities = this.houseForm.get('facilities')?.value || [];
    const index = currentFacilities.indexOf(facility);
    if (index > -1) {
      currentFacilities.splice(index, 1);
    } else {
      currentFacilities.push(facility);
    }
    this.houseForm.patchValue({ facilities: currentFacilities });
  }

  isFacilitySelected(facility: string): boolean {
    const currentFacilities = this.houseForm.get('facilities')?.value || [];
    return currentFacilities.includes(facility);
  }

  get f() { return this.houseForm.controls; }

  onSubmit(): void {
    if (this.houseForm.invalid) {
      this.markFormGroupTouched(this.houseForm);
      return;
    }

    this.submitting = true;
    this.error = '';

    const formValue = this.houseForm.value;
    const request: HouseRequest = {
      title: formValue.title,
      description: formValue.description || undefined,
      province: formValue.province,
      city: formValue.city,
      district: formValue.district,
      address: formValue.address || undefined,
      price: formValue.price,
      area: formValue.area,
      bedroom: formValue.bedroom,
      livingRoom: formValue.livingRoom,
      bathroom: formValue.bathroom,
      orientation: formValue.orientation || undefined,
      floor: formValue.floor || undefined,
      decoration: formValue.decoration || undefined,
      houseType: formValue.houseType || undefined,
      images: formValue.images || undefined,
      facilities: formValue.facilities?.join(',') || undefined
    };

    const observable = this.isEdit && this.houseId
      ? this.houseService.updateHouse(this.houseId, request)
      : this.houseService.createHouse(request);

    observable.subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/my-houses']);
      },
      error: (err) => {
        this.error = err.error || '操作失败，请稍后重试';
        this.submitting = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/my-houses']);
  }
}
