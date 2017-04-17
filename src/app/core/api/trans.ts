// Generated by node-private-tools
import { Pipe, PipeTransform } from '@angular/core';
export const trans = {
  Order: {
    Remark: '备注',
    Unit: '单位',
    Quantity: '数量',
    Price: '单价',
    Name: '名称',
    PayAmount: '金额',
    State: '状态',
  },
  SetUserInfoPayload: {
    Nickname: '昵称',
    Sex: '性别',
  },
};

@Pipe({ name: 'Order' })
export class OrderPipe implements PipeTransform {
  transform(value: string) {
    return (<any>trans).Order[value] || value;
  }
}
@Pipe({ name: 'SetUserInfoPayload' })
export class SetUserInfoPayloadPipe implements PipeTransform {
  transform(value: string) {
    return (<any>trans).SetUserInfoPayload[value] || value;
  }
}

export const GEN_TRANS_PIPES = [
  OrderPipe,
  SetUserInfoPayloadPipe,
];
