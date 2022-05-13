import { Component, OnInit } from '@angular/core';
import {debounceTime, distinctUntilChanged, Observable, Subject, switchMap} from "rxjs";
import {Hero} from "../hero";
import {HeroService} from "../hero.service";

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent implements OnInit {

  heroes$!: Observable<Hero[]>;

  //rxjs subject 객체: 옵저버블 객체처럼 구독할 수 있음
  //여러 메소드를 갖고 있음. next(v), error(e) 등
  private  searchTerms = new Subject<string>();
  //사용자가 입력한 검색어를 옵저버블 스트림으로 보낸다.
  search(term:string): void {
    //next(value): subject에 새 값을 제공
    this.searchTerms.next(term);
  }

  constructor( private heroService: HeroService) {
  }

  //Rxjs 연산자 체이닝하기
  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      //연속된 키 입력 처리: 300ms 대기
      //옵저버블로 전달된 문자열을 바로 보내지 않고 다음 이벤트가 올때까지 300ms기다림
      //사용자가 보내는 요청은 300ms에 하나로 제한
      debounceTime(300),
      //사용자가 입력한 문자열의 내용이 변경되었을 때만 전달
      distinctUntilChanged(),

      //debounce와 dinstincUntilChanged를 통과했을 때 서비스에 있는 검색 기능 호출
      //제일 마지막에 보낸 http 요청만 남겨둘 수 있음
      switchMap((term:string)=>this.heroService.searchHeroes(term))

    )
  }

}
