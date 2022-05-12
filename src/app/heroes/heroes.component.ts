import {Component, OnInit} from '@angular/core';
import {Hero} from '../hero';
import {HeroService} from "../hero.service";
import {MessageService} from "../message.service";


@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {

  heroes:Hero[] = [];
  hero: Hero ={
    id: 1,
    name:"Windstorm"
  }

  //서비스 주입하기
  constructor(
    //HeroService 타입의 heroService 인자를 선언하고 privatefh wlwjd
    private heroService: HeroService,
    private messageService:MessageService
  ) { }
//서비스에서 히어로 목록 받아오는 메소드
  getHeroes():void {
    //옵저버블을 사용하는 코드
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes)
  }

  //라이프사이클 후킹 함수: 이 컴포넌트의 인스턴스를 생성한 직후 실행되는 함수
  ngOnInit(): void {
    this.getHeroes();
  }

  add(name: string):void {
    //문자열 양 쪽의 공백을 제거함
    name = name.trim();
    //이름값이 없으면 종료
    if(!name) {return;}
    //히어로 서비스의 addHero()메서드 실행
      //name을 이용해서 Hero와 호환되는 객체 생성
    this.heroService.addHero({name} as Hero)
      .subscribe(hero=>{
        this.heroes.push(hero);
      })
  }

  delete(hero:Hero):void {
    this.heroes = this.heroes.filter((h=> h !== hero));
    this.heroService.deleteHero(hero.id).subscribe();
  }

}
