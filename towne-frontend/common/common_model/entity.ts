/**
 * 공통 엔티티 타입 정의
 */

export interface BaseEntity {
  key: number;
  insertDate: string;
  updateDate?: string;
}

export interface AuditableEntity extends BaseEntity {
  insertIp?: string;
  insertMemberKey?: number;
  updateIp?: string;
  updateMemberKey?: number;
}
