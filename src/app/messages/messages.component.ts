import { Component, OnInit } from '@angular/core';
import {MessageService} from "../message.service";



@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  constructor(
    //메세지 서비스는 탬플릿에 바인딩 되기 때문에 반드시 public으로 선언
    //public으로 선언된 컴포넌트 프로퍼티만 바인딩할 수 있음.
    public messageService:MessageService
  ) { }

  ngOnInit(): void {
  }

}
