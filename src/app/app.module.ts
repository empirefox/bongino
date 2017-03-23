// external module
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AlertModule, DatepickerModule } from 'ng2-bootstrap';
import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { ToasterModule } from 'angular2-toaster/angular2-toaster';
import { environment } from '../environments/environment';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { TreeModule } from 'angular-tree-component';
import { Observable } from 'rxjs/Observable';

import { value as patterns } from 'ng2-ef-inputs/ng2-pattern-input/patterns';
import {
  Ng2AmapInputModule, AMAP_KEY,
  Ng2BgInputModule,
  Ng2FaInputModule, FA_NAMES_SRC, FaNamesSource,
  Ng2SvgPatternInputModule, SVG_PATTERNS,
  Ng2ColorfulInputModule,
  Ng2TriangifyInputModule,
  Ng2QiniuImageInputModule, QiniuConfig, QINIU_CONFIGS, QINIU_HTTP,
  Ng2SmdInputModule
} from 'ng2-ef-inputs';

import { ModalModule } from 'angular2-modal';
import { JsonSchemaFormModule } from 'angular2-json-schema-form/src';
import { EfWidgetsModule } from 'ng2-ef-widgets';

export function faCss1(http: Http) {
  let re = /@font-face\s*\{\s*font-family:\s*'FontAwesome'/;
  let list = document.querySelectorAll('head>style');
  for (let i = 0; i < list.length; ++i) {
    let text = list[i].textContent;
    if (re.test(text)) {
      return Observable.of(text);
    }
  }
  return Observable.of('');
}

export function faCss2(http: Http) {
  let re = /styles\.([a-z0-9-]+\.)?bundle\.css/;
  for (let i = 0; i < document.styleSheets.length; i++) {
    let href = document.styleSheets[i].href;
    if (re.test(href)) {
      return http.get(href).map(res => res.text());
    }
  }
}

export function uptokenUrl(key: string) { return `http://127.0.0.1:9999/qiniu/uptoken/${key}/1`; };
export function listUrl(prefix: string) { return `http://127.0.0.1:9999/qiniu/${prefix}`; };
export function deleteUrl(key: string) { return `http://127.0.0.1:9999/qiniu/${key}`; };
export function profileUptokenUrl(key: string) { return `http://127.0.0.1:9999/qiniu/headtoken/30`; };

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, '../public/assets/i18n', '.json');
}

let modules = [
  AlertModule.forRoot(),
  DatepickerModule.forRoot(),
  BrowserModule,
  FormsModule,
  HttpModule,
  RouterModule,
  AngularFireModule.initializeApp(environment.firebase),
  TranslateModule.forRoot({
    deps: [Http],
    provide: TranslateLoader,
    useFactory: (createTranslateLoader)
  }),
  ToasterModule,
  TreeModule,

  Ng2AmapInputModule.forRoot(),
  Ng2BgInputModule,
  Ng2ColorfulInputModule.forRoot(),
  Ng2FaInputModule.forRoot(),
  Ng2SvgPatternInputModule.forRoot(),
  Ng2QiniuImageInputModule.forRoot(),
  Ng2SmdInputModule.forRoot(),
  Ng2TriangifyInputModule.forRoot(),

  ModalModule.forRoot(),
  JsonSchemaFormModule.forRoot(),
  EfWidgetsModule.forRoot('site', 's/20/'),
];

import { AppComponent } from './app.component';

import { AppHeaderComponent } from './widgets/app-header';
import { AppFooterComponent } from './widgets/app-footer';
import { MenuAsideComponent } from './widgets/menu-aside';
import { ControlSidebarComponent } from './widgets/control-sidebar';
import { MessagesBoxComponent } from './widgets/messages-box';
import { NotificationBoxComponent } from './widgets/notification-box';
import { TasksBoxComponent } from './widgets/tasks-box';
import { UserBoxComponent } from './widgets/user-box';
import { BreadcrumbComponent } from './widgets/breadcrumb';

let widgets = [
  AppComponent,
  BreadcrumbComponent,
  AppHeaderComponent,
  AppFooterComponent,
  MenuAsideComponent,
  ControlSidebarComponent,
  MessagesBoxComponent,
  NotificationBoxComponent,
  TasksBoxComponent,
  UserBoxComponent
];

import { UserService } from './services/user.service';
import { MessagesService } from './services/messages.service';
import { CanActivateGuard } from './services/guard.service';
import { NotificationService } from './services/notification.service';
import { BreadcrumbService } from './services/breadcrumb.service';
import { AdminLTETranslateService } from './services/translate.service';
import { LoggerService } from './services/logger.service';

import { APP_CORE_PROVIDERS } from './core';

let services = [
  ...APP_CORE_PROVIDERS,

  UserService,
  BreadcrumbService,
  MessagesService,
  CanActivateGuard,
  NotificationService,
  AdminLTETranslateService,
  LoggerService,

  { provide: AMAP_KEY, useValue: 'd3f5d8b3b05231fa6a11375492310e3a' },
  { provide: FA_NAMES_SRC, useValue: <FaNamesSource>{ css: faCss1 } },
  { provide: SVG_PATTERNS, useValue: patterns },
  { provide: QINIU_HTTP, useExisting: Http }, // AuthHttp
  {
    provide: QINIU_CONFIGS,
    useValue: <QiniuConfig[]>[
      {
        name: 'site',
        bucketDomain: 'http://7xtjjx.com2.z0.glb.qiniucdn.com/',
        thumbnailStyle: '-48x48',
        uptokenUrl,
        listUrl,
        deleteUrl,
      },
      {
        name: 'profile',
        bucketDomain: 'http://7xtjjx.com2.z0.glb.qiniucdn.com/',
        thumbnailStyle: '-48x48',
        cacheUptoken: true,
        uptokenUrl: profileUptokenUrl,
        // Not used
        // listUrl: (prefix: string) => `http://127.0.0.1:9999/qiniu/list/${prefix}`,
        // deleteUrl: (key: string) => `http://127.0.0.1:9999/qiniu/delete/${key}`,
      },
    ],
  },
];

// les pages
import { HomeComponent } from './pages/home/home.component';
import { PageNumComponent } from './pages/page-num/page-num.component';
import { ClientComponent } from './pages/client/client.component';
import { LayoutsAuthComponent } from './pages/layouts/auth/auth';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

let pages = [
  HomeComponent,
  PageNumComponent,
  ClientComponent,
  LayoutsAuthComponent,
  LoginComponent,
  RegisterComponent
];
import { PageComponent } from './pages/page/page.component';

// main bootstrap
import { routing } from './app.routes';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    ...widgets,
    ...pages,
    PageComponent
  ],
  imports: [
    ...modules,
    routing
  ],
  providers: [
    ...services
  ]
})
export class AppModule { }
