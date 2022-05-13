import {Component, Input, OnInit} from '@angular/core';
//Hero 심볼 로드(인터페이스)
import {Hero} from "../hero";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {HeroService} from "../hero.service";


@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss']
})

export class HeroDetailComponent implements OnInit {
  //Input 데코레이터를 이용해 부모컴포넌트로부터 props을 받아온다.
  hero?: Hero;

  constructor(
    private route: ActivatedRoute,
    //HeroDetailComponent의 라우팅 규칙에 대한 정보를 담고 있음 => 라우팅 규칙을 참조하면 URL에 포함된 라우팅 변수 id를 추출할 수 있다.
    private heroService: HeroService,
    //컴포넌트에 사용할 히어로 데이터 : HeroService를 사용함
    private location: Location,
    //브라우저 제어, 이전 페이지로 돌아가기 기능을 구현할 수 있음
  ) {
  }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id).subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }

  save():void {
    if(this.hero) {
      this.heroService.updateHero(this.hero)
        .subscribe(()=>this.goBack());
    }
  }


}
