//히어로 데이터를 관리하는 서비스
import {HEROES} from "./mock-heroes";
import {Hero} from "./hero";


import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {MessageService} from "./message.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, tap} from "rxjs";


//Injectable: 서비스를 정의하는 메타데이터 객체를 인자로 받는다.
//이 클래스가 의존성 주입 시스템에 포함되는 클래스라고 선언함
//의존성으로 주입될 수도 있고, 의존성을 주입받을 수도 있음.
@Injectable({
  providedIn: 'root'
})
export class HeroService {

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_=>this.log('hetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes',[])))
    //옵저버블로 받은 데이터를 pipe() 메소드로 확장
    // 파이프에 catchError()를 연결
    //tap(): 받은 데이터를 이용해서 어떤 동작을 수행함 - 여기서는 log() 함수를 써서 메세지를 표시하도록 했음.
  }

  // GET으로 히어로 데이터 가져오기. 데이터가 없으면 404 반환
  getHero(id:number): Observable<Hero> {
    //인자로 받은 id로 url을 구성
    const url = `${this.heroesUrl}/${id}`;
    //서버가 반환하는 응답은 히어로 한명의 데이터(배열이 아니라 객체)
    return this.http.get<Hero>(url).pipe(
      tap(_=> this.log(`히어로 아이디=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    )
  }

  //PUT: 서버에 저장된 히어로 데이터를 변경
  //httpClient.put(URL,수정할 데이터(수정된 히어로 데이터), 옵션)
  updateHero(hero:Hero) : Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_=> this.log(`히어로 아이디${hero.id}를 업데이트했습니다.`)),
      catchError(this.handleError<any>('updateHero'))
    )
}
  //POST : 서버에 새로운 히어로를 추가
  addHero(hero:Hero):Observable<Hero>{
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap((newHero:Hero)=>this.log(`새로운 히어로(아이디:${newHero.id})가 생성됐습니다.`)),
        catchError(this.handleError<Hero>(`addHero`))

      )
  }

  //DELETE: 서버에서 히어로 제거
  deleteHero(id:number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`
    return this.http.delete<Hero>(url,this.httpOptions)
      .pipe(
        tap(_=>this.log(`히어로(id:${id})를 삭제했습니다.`)),
        catchError(this.handleError<Hero>(`deleteHero`))
      )
  }
//예제에서 사용하는 웹 api에 헤더가 존재함
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  // const hero = HEROES.find(h => h.id === id)!;
  // //느낌표: null이 아닌 어선셜 연산자 (Non-null assertion operator)
  // //값이 무조건 할당되어있다고 컴파일러에게 전달하여 값이 없어도 변수나 객체를 사용할 수 있음
  // this.messageService.add(`HeroService: fetched hero id=${id}`)
  // return of(hero);
  /** HeroService에서 보내는 메시지는 MessageService가 화면에 표시합니다. */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
  private heroesUrl = 'api/heroes' //웹 api 형식의 url로 사용


  //Http 요청이 실패한 경우!
  //operation: 실패한 동작의 이름
  //result: 기본값으로 반환할 객체(애플리케이션 로직이 끊기지 않도록)
  private handleError<T>(operation = 'operation', result?:T) {
    return (error:any): Observable<T> => {
      //콘솔에 에러 출력
      console.error(error);
      // 사용자가 이해할 수 있는 형태로 변환
      this.log(`${operation} failed: ${error.message}`)

      //어플리케이션 로직이 끊기지 않도록 기본값으로 받은 객체를 반환함
      return of(result as T);

    }
  }

  //검색기능
  searchHeroes(term:string): Observable<Hero[]> {
    if(!term.trim()) {
      //입력된 내용이 없는 경우 빈 배열 반환
      return of ([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) { }
}
