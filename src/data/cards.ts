import { CardData, ECardType, EUnitType } from '@/types/card';

const rawData = `201111,marine_title_common1,marine_desc_common1,Common,Marine,"MarineIncreaseProjectileCount,CommonDecreaseDamage","1,15",22,2,1,1,,None,탄환 추가,탄환+1 피해-15%
201112,marine_title_common2,marine_desc_common2,Common,Marine,CommonIncreaseDamage,50,33,3,1,1,,None,피해 강화,피해+50%
201113,marine_title_common3,marine_desc_common3,Common,Marine,CommonIncreaseAttackSpeed,20,11,1,1,7,,None,급속 재장전,쿨타임 가속+20%
201114,marine_title_common4,marine_desc_common4,Common,Marine,MarineIncreaseProjectileCountOnly,1,22,2,1,6,,None,탄환 추가+,탄환+1
201115,marine_title_common5,marine_desc_common5,Common,Marine,MarineIncreasePenetrationBasic,1,33,3,1,1,,None,관통탄,탄환 관통+1
201121,marine_title_chain1,marine_desc_chain1,Chain,Marine,MarineIncreaseSteampackEffect,100,11,1,1,1,,None,스팀팩,50발 발사 후 발동<br>40발 동안<br>피해+100%<br>쿨타임 가속+100%
201122,marine_title_chain2,marine_desc_chain2,Chain,Marine,MarineAddExplosionOnHit,10,11,1,1,1,,None,폭발탄,10% 확률로 탄환 명중 시 폭발
201131,marine_title_promotion1,marine_desc_promotion1,Promotion,Marine,MarineAddAuxiliaryProjectile,2,10,1,1,1,,None,보조탄환,보조탄환 2발 추가
201132,marine_title_promotion2,marine_desc_promotion2,Promotion,Marine,"CommonIncreaseDamage,CommonIncreaseKnockback","100,-99.5",10,1,1,4,,None,충격탄,피해+100%<br>넉백 추가<br>스팀팩 중에는 넉백+200%
201133,marine_title_promotion3,marine_desc_promotion3,Promotion,Marine,MarineAddAuxiliaryOnHit,1,10,1,1,1,,None,탄환분열,탄환에서 보조탄환 분열<br>스팀팩 중에는 보조탄환 2배
201221,marine_title_chain3,marine_desc_chain3,Chain,Marine,MarineDecreaseSteampackTrigger,50,11,1,2,2,201121,None,추가 스팀팩,스팀팩 요구 발수 반감
201222,marine_title_chain4,marine_desc_chain4,Chain,Marine,MarineIncreaseSteampackDuration,80,11,1,2,3,201121,None,스팀팩+,스팀팩 탄환+100%
201223,marine_title_chain5,marine_desc_chain5,Chain,Marine,MarineIncreaseExplosionRadius,50,11,1,2,1,201122,None,폭발 범위+,탄환 폭발범위 50% 증가
201231,marine_title_promotion4,marine_desc_promotion4,Promotion,Marine,MarineIncreasePenetration,2,10,1,2,1,,None,관통탄+,모든 탄환 관통+2
201232,marine_title_promotion5,marine_desc_promotion5,Promotion,Marine,MarineAddProjectileReflection,2,10,1,2,1,,None,반사탄,모든 탄환 반사+2
201241,marine_title_combo1,marine_desc_combo1,Combo,Marine,MarineTriggerStormOnKill,50,10,1,2,1,,Templer1,번개탄,적 처치 시 소형번개 발동 확률 50%
201242,marine_title_combo2,marine_desc_combo2,Combo,Marine,MarineChangeDamageToMachine,1,10,1,2,1,,Turret1,합금탄,탄환 피해 기계타입으로 변화
201321,marine_title_chain6,marine_desc_chain6,Chain,Marine,MarineIncreaseExplosionDamageAndChance,60,11,1,3,1,201223,None,폭발 강화,탄환 폭발피해+60% 폭발 확률+10%
201341,marine_title_combo3,marine_desc_combo3,Combo,Marine,MarineTriggerRuptureOnHit,20,10,1,3,5,,Archon2,파열탄,20% 확률로 탄환 명중 시 파열광선 발동<br>스팀팩 중 확률 2배
201342,marine_title_combo4,marine_desc_combo4,Combo,Marine,MarineAddDisruptOnHit,10,10,1,3,5,,DrFrost1,와해탄,10% 확률로 탄환 명중 시 [와해] 부여
201401,unit_title_arousal,unit_desc_arousal,Common,Marine,,,0,1,3,8,,None,각성 모드,최대 랭크가 되면 각성합니다.
202001,turret_title_spawn,turret_desc_spawn,Spawn,Turret,,,66,1,1,1,,None,터렛,기계타입<br>범위피해를 입히는<br>유도 미사일 발사
202111,turret_title_common1,turret_desc_common1,Common,Turret,"TurretIncreaseMissileCount,CommonDecreaseDamage","1,15",33,3,1,1,,None,미사일 추가,유도미사일+1<br>피해-15%
202112,turret_title_common2,turret_desc_common2,Common,Turret,TurretIncreaseExplosionRadius,45,33,3,1,1,,None,범위 강화,유도미사일<br>폭발범위+45%
202113,turret_title_common3,turret_desc_common3,Common,Turret,TurretModifyDamagePercentage,50,33,3,1,1,,None,피해 강화,유도미사일<br>피해+50%
202121,turret_title_chain1,turret_desc_chain1,Chain,Turret,TurretAddSmallMissile,3,11,1,1,1,,None,소형미사일,유도미사일 명중 시<br>소형미사일 3발 발사
202122,turret_title_chain2,turret_desc_chain2,Chain,Turret,TurretAddIgniteEffect,1,11,1,1,2,,None,점화 미사일,유도미사일 명중 시<br>[점화] 부여
202131,turret_title_promotion1,turret_desc_promotion1,Promotion,Turret,TurretIncreaseDirectDamage,200,10,1,1,1,,None,직격 강화,유도미사일<br>직격피해+200%
202132,turret_title_promotion2,turret_desc_promotion2,Promotion,Turret,TurretAddBurnAfterExplosion,5,10,1,1,1,,None,연소 미사일,유도미사일 폭발 시<br>5초간 폭발영역 연소
202221,turret_title_chain3,turret_desc_chain3,Chain,Turret,TurretAddSmallMissile,3,11,1,2,1,202121,None,소형미사일+,소형미사일+3
202222,turret_title_chain4,turret_desc_chain4,Chain,Turret,TurretSmallMissileExplosion,60,11,1,2,14,202121,None,소형미사일 폭발,소형미사일 명중 시<br>60% 확률로 폭발
202223,turret_title_chain5,turret_desc_chain5,Chain,Turret,TurretIncreaseIgniteDamage,100,11,1,2,6,202122,None,점화 강화,[점화] 피해+100%
202231,turret_title_promotion3,turret_desc_promotion3,Promotion,Turret,TurretIncreaseMissileCount,2,10,1,2,1,,None,미사일 포화,유도미사일+2
202232,turret_title_promotion4,turret_desc_promotion4,Promotion,Turret,TurretAddExplosionOnHit,1,10,1,2,10,,None,추가 폭발,유도미사일 명중 시<br>추가 폭발
202241,turret_title_combo1,turret_desc_combo1,Combo,Turret,TurretCreateWhirlpoolOnExplosion,1,10,1,2,1,,AirMan1,저기압 미사일,유도미사일 폭발 후<br>회오리 생성
202321,turret_title_chain6,turret_desc_chain6,Chain,Turret,TurretSmallMissileChain,60,11,1,3,1,"202221,202222",None,연쇄 미사일,60% 확률로<br>소형미사일 명중 시<br>소형미사일 추가 발사
202331,turret_title_promotion5,turret_desc_promotion5,Promotion,Turret,TurretAddIgniteOnPath,1,10,1,3,1,,None,점화 궤적,유도미사일이<br>경로 위 적에게<br>[점화] 부여
202341,turret_title_combo2,turret_desc_combo2,Combo,Turret,TurretTriggerLightningOnKill,1,10,1,3,1,,Templer2,뇌격 미사일,유도미사일이<br>적 처치 시<br>뇌격 방출
202342,turret_title_combo3,turret_desc_combo3,Combo,Turret,TurretDamageOnPath,1,10,1,3,1,,Marine2,궤도 타격,유도미사일이<br>경로 위 적에게<br>피해
202401,unit_title_arousal,unit_desc_arousal,Common,Turret,,,0,1,3,18,,None,각성 모드,최대 랭크가 되면 각성합니다.
203001,archon_title_spawn,archon_desc_spawn,Spawn,Archon,,,66,1,1,1,,None,제우스,외계타입<br>지속피해를 입히는<br>관통 광선 발사
203111,archon_title_common1,archon_desc_common1,Common,Archon,ArchonIncreaseLaserDuration,40,33,3,1,1,,None,광선 정렬,관통광선<br>지속시간+40%
203112,archon_title_common2,archon_desc_common2,Common,Archon,"ArchonIncreaseLaserReflection,CommonDecreaseDamage","1,20",33,3,1,1,,None,반사광선,관통광선 반사+1<br>반사 시 피해-20%
203113,archon_title_common3,archon_desc_common3,Common,Archon,CommonIncreaseDamage,50,33,3,1,1,,None,출력 증폭,관통광선 피해+50%
203121,archon_title_chain1,archon_desc_chain1,Chain,Archon,ArchonAddSweepingLaser,1,11,1,1,1,,None,와이퍼광선,와이퍼광선 추가
203122,archon_title_chain2,archon_desc_chain2,Chain,Archon,ArchonAddAuxiliaryLaser,2,11,1,1,2,,None,보조광선,보조광선 2개 추가
203131,archon_title_promotion1,archon_desc_promotion1,Promotion,Archon,ArchonIncreaseLaserWidth,100,10,1,1,1,,None,출력 강화,관통광선<br>너비+100%
203132,archon_title_promotion2,archon_desc_promotion2,Promotion,Archon,"ArchonIncreaseLaserDuration, ArchonIncreaseCooldownAcceleration","100,20",10,1,1,1,,None,과출력,관통광선 지속시간+100%<br>쿨타임 가속+20%
203221,archon_title_chain3,archon_desc_chain3,Chain,Archon,ArchonAddVulnerabilityDebuff,1,11,1,2,1,203121,None,취약광선,와이퍼광선 명중 시<br>[취약] 부여
203222,archon_title_chain4,archon_desc_chain4,Chain,Archon,ArchonAddSlowDebuff,1,11,1,2,6,203122,None,감속광선,보조광선 명중 시<br>[감속] 부여
203231,archon_title_promotion3,archon_desc_promotion3,Promotion,Archon,ArchonIncreaseDebuffDuration,100,10,1,2,1,,None,디버프 지속,모든 광선 디버프<br>지속시간+100%
203232,archon_title_promotion4,archon_desc_promotion4,Promotion,Archon,ArchonAddRuptureEffect,20,10,1,2,1,,None,파열광선,20% 확률로 관통광선 명중 시<br>파열광선 발동
203233,archon_title_promotion5,archon_desc_promotion5,Promotion,Archon,ArchonDebuffBasedDamageIncrease,60,10,1,2,18,,None,약점 포착,적 디버프당<br>관통광선 피해+60%<br>최대+300%
203241,archon_title_combo1,archon_desc_combo1,Combo,Archon,ArchonAddParalysisDebuff,1,10,1,2,1,,Templer1,마비광선,관통광선 명중 시<br>[마비] 부여
203321,archon_title_chain5,archon_desc_chain5,Chain,Archon,ArchonAddSweepingLaser,1,11,1,3,1,203221,None,와이퍼광선+,와이퍼광선 추가
203322,archon_title_chain6,archon_desc_chain6,Chain,Archon,ArchonAuxiliaryLaserReflection,1,11,1,3,14,203222,None,보조광선 반사,보조광선 반사+1
203341,archon_title_combo2,archon_desc_combo2,Combo,Archon,ArchonIgniteExplosion,1,10,1,3,1,,Turret2,점화광선,[점화] 상태인 적 명중 시<br>점화 폭발 1회
203401,unit_title_arousal,unit_desc_arousal,Common,Archon,,,0,1,3,10,,None,각성 모드,최대 랭크가 되면 각성합니다.
204001,drfrost_title_spawn,drfrost_desc_spawn,Spawn,DrFrost,,,66,1,1,1,,None,눈사람,자연타입<br>지속피해를 입히는<br>눈보라 생성<br>[감속] 부여
204111,drfrost_title_common1,drfrost_desc_common1,Common,DrFrost,DrFrostIncreaseBlizzardDuration,25,33,3,1,1,,None,연료 충전,눈보라 지속시간+25%
204112,drfrost_title_common2,drfrost_desc_common2,Common,DrFrost,DrFrostIncreaseBlizzardWidth,30,33,3,1,1,,None,범위 강화,눈보라 너비+30%
204113,drfrost_title_common3,drfrost_desc_common3,Common,DrFrost,CommonIncreaseDamage,50,33,3,1,1,,None,피해 강화,눈보라 피해+50%
204121,drfrost_title_chain1,drfrost_desc_chain1,Chain,DrFrost,DrFrostAddDisruptStack,1,11,1,1,1,,None,와해드론,피해를 입힐 때<br>[와해] 1스택 부여
204122,drfrost_title_chain2,drfrost_desc_chain2,Chain,DrFrost,DrFrostKnockbackToStart,5,11,1,1,2,,None,격퇴,피해를 입힐 때<br>5% 확률로<br>적을 위로 날린다
204131,drfrost_title_promotion1,drfrost_desc_promotion1,Promotion,DrFrost,DrFrostIncreaseSlowEffect,10,10,1,1,1,,None,감속 누적,피해를 입힐 때<br>[감속] 효과+10%<br>최대 90%
204132,drfrost_title_promotion2,drfrost_desc_promotion2,Promotion,DrFrost,DrFrostBlizzardEndExplosion,1,10,1,1,1,,None,서리 폭발,눈보라 종료 시 폭발
204221,drfrost_title_chain3,drfrost_desc_chain3,Chain,DrFrost,DrFrostTriggerDisruptExplosion,1,11,1,2,1,204121,None,와해 폭발,[와해] 스택 최대 시<br>강력한 폭발 추가
204222,drfrost_title_chain4,drfrost_desc_chain4,Chain,DrFrost,DrFrostKnockbackToOrigin,2.5,11,1,2,6,204122,None,격퇴+,피해를 입힐 때<br>2.5% 확률로<br>적을 더 멀리 날린다
204231,drfrost_title_promotion3,drfrost_desc_promotion3,Promotion,DrFrost,"DrFrostDecreaseBlizzardInterval,CommonDecreaseCooltime","30,30",10,1,2,1,,None,급속 충전,피해간격-30%<br>쿨타임 가속+30%
204232,drfrost_title_promotion4,drfrost_desc_promotion4,Promotion,DrFrost,DrFrostSlowBasedDamage,200,10,1,2,1,,None,혹한서리,적 속도가 느릴수록<br>눈보라 피해 증가<br>최대+200%
204241,drfrost_title_combo1,drfrost_desc_combo1,Combo,DrFrost,DrFrostAddFreezeEffect,30,10,1,2,1,,Thor1,빙결,피해를 입힐 때<br>30% 확률로<br>[빙결] 부여
204242,drfrost_title_combo2,drfrost_desc_combo2,Combo,DrFrost,DrFrostArchonLaserBeam,1,10,1,2,1,,Archon1,서리광선,눈보라에<br>보조광선 생성
204321,drfrost_title_chain5,drfrost_desc_chain5,Chain,DrFrost,DrFrostTriggerDisruptExplosion,1,11,1,3,1,204221,None,와해 폭발+,[와해] 스택 최대 시<br>폭발 1회 추가
204322,drfrost_title_chain6,drfrost_desc_chain6,Chain,DrFrost,DrFrostKnockbackMaxHealthDamage,3,11,1,3,10,204222,None,빙결 타격,눈보라가 적을 날릴 때<br>적 최대 체력의 3% 피해
204331,drfrost_title_promotion5,drfrost_desc_promotion5,Promotion,DrFrost,"CommonIncreaseDamage,DrFrostPullToCenter","100,0.25",10,1,3,18,,None,눈폭풍,눈보라 피해+100%<br>피해를 입힐 때<br>적을 중심으로 당김
204341,drfrost_title_combo3,drfrost_desc_combo3,Combo,DrFrost,DrFrostSpawnAdditionalBlizzard,-2.6,10,1,3,1,,Marine2,눈보라 지원,벙커 바로 위에<br>눈보라 추가 생성
204342,drfrost_title_combo4,drfrost_desc_combo4,Combo,DrFrost,DrFrostNinjaComboDoubleExtraAttackLimit,1,10,1,3,1,,Ninja2,혹한기 훈련,어쌔신이 눈보라 안에서<br>최초 공격 시<br>공격 한도 2배
204401,unit_title_arousal,unit_desc_arousal,Common,DrFrost,,,0,1,3,14,,None,각성 모드,최대 랭크가 되면 각성합니다.
205001,marauder_title_spawn,marauder_desc_spawn,Spawn,Marauder,,,66,1,1,1,,None,고릴라,인간타입<br>폭발피해를 입히는<br>충격탄 발사
205111,marauder_title_common1,marauder_desc_common1,Common,Marauder,MarauderIncreaseShockDamage,50,33,3,1,1,,None,피해 강화,충격탄 피해+50%
205112,marauder_title_common2,marauder_desc_common2,Common,Marauder,"CommonIncreaseKnockback,MarauderIncreaseShockDamage","50,30",33,3,1,1,,None,넉백 강화,충격탄 넉백+50%<br>피해+30%
205113,marauder_title_common3,marauder_desc_common3,Common,Marauder,"MarauderIncreaseShockCount, CommonDecreaseDamage","1, 15",33,3,1,1,,None,추가 사격,충격탄+1<br>피해-15%
205121,marauder_title_chain1,marauder_desc_chain1,Chain,Marauder,MarauderAddFloatingLightning,2,11,1,1,2,,None,부유지뢰,충격탄 명중 시<br>부유지뢰 2개 생성
205122,marauder_title_chain2,marauder_desc_chain2,Chain,Marauder,MarauderAddPenetratingBuckshot,5,11,1,1,1,,None,관통산탄,충격탄 발사 후<br>관통 산탄 5개 발사
205131,marauder_title_promotion1,marauder_desc_promotion1,Promotion,Marauder,MarauderIncreaseExplosionRadius,70,10,1,1,1,,None,범위 강화,폭발범위+70%
205132,marauder_title_promotion2,marauder_desc_promotion2,Promotion,Marauder,MarauderAddHighEnergyExplosion,1,10,1,1,1,,None,추가 폭발,충격탄 명중 시<br>강력한 폭발 추가
205221,marauder_title_chain3,marauder_desc_chain3,Chain,Marauder,"MarauderAddFloatingLightning,MarauderIncreaseLightningDamage","2,25",11,1,2,6,205121,None,지뢰 강화,부유지뢰+2<br>부유지뢰 피해+25%
205222,marauder_title_chain4,marauder_desc_chain4,Chain,Marauder,"MarauderAddFloatingLightning,MarauderIncreaseLightningKnockback","2,50",11,1,2,14,205121,None,지뢰 넉백,부유지뢰+2<br>부유지뢰 넉백+50%
205223,marauder_title_chain5,marauder_desc_chain5,Chain,Marauder,MarauderAddBuckshotOnKill,10,11,1,2,1,205122,None,연쇄산탄,적 처치마다<br>관통 산탄 추가 발사<br>최대 10회
205231,marauder_title_promotion3,marauder_desc_promotion3,Promotion,Marauder,MarauderHitCountBasedDamage,20,10,1,2,1,,None,피해 증폭,충격탄 명중 시<br>피격 적 1기마다<br>폭발피해+20%<br>최대+200%
205232,marauder_title_promotion4,marauder_desc_promotion4,Promotion,Marauder,MarauderDelayedExplosionOnHit,1,10,1,2,18,,None,지연 폭발,기본피해를 입은 적<br>1초 후에 폭발
205233,marauder_title_promotion5,marauder_desc_promotion5,Promotion,Marauder,MarauderIncreaseRange,70,10,1,2,1,,None,사거리 강화,고릴라 사거리+70%
205241,marauder_title_combo1,marauder_desc_combo1,Combo,Marauder,MarauderSpawnVesselOnExplosion,1,10,1,2,1,,Vessel1,드론 탄환,폭발피해 피격 적당<br>소형지우개 1기 생성
205242,marauder_title_combo2,marauder_desc_combo2,Combo,Marauder,MarauderAddShockPenetration,1,10,1,2,1,,Ninja1,관통탄,충격탄 관통+1
205321,marauder_title_chain6,marauder_desc_chain6,Chain,Marauder,"MarauderIncreaseBuckshotDamage, MarauderIncreaseBuckshotRange","50,70",11,1,3,1,205223,None,산탄 강화,관통 산탄 피해+50%<br>사거리+70%
205341,marauder_title_combo3,marauder_desc_combo3,Combo,Marauder,"MarauderIncreaseShockDamage, MarauderAddExplosionPull","100,0.5",10,1,3,1,,AirMan2,와류탄,충격탄 피해+100%<br>폭발 직전<br>적을 중심으로 당김
205401,unit_title_arousal,unit_desc_arousal,Common,Marauder,,,0,1,3,10,,None,각성 모드,최대 랭크가 되면 각성합니다.
206001,templer_title_spawn,templer_desc_spawn,Spawn,Templer,,,66,1,1,1,,None,사도,고대타입<br>명중 시 전이되는<br>번개 발사
206111,templer_title_common1,templer_desc_common1,Common,Templer,"TemplerDecreaseCooldown,CommonIncreaseDamage","10,30",33,3,1,1,,None,급속 충전,쿨타임 가속+10%<br>피해+30%
206112,templer_title_common2,templer_desc_common2,Common,Templer,CommonIncreaseDamage,50,33,3,1,1,,None,피해 강화,피해+50%
206113,templer_title_common3,templer_desc_common3,Common,Templer,"TemplerIncreaseLightningBounceCount, CommonDecreaseDamage","15,15",33,3,1,1,,None,전이 강화,전이+15<br>피해-15%
206121,templer_title_chain1,templer_desc_chain1,Chain,Templer,TemplerAddParalysisEffect,1,11,1,1,1,,None,마비 번개,번개 명중 시<br>[마비] 부여
206122,templer_title_chain2,templer_desc_chain2,Chain,Templer,TemplerTriggerMiniLightningOnHit,5,11,1,1,2,,None,소형 번개,번개 명중 시<br>소형번개 발사<br>최초 5회
206131,templer_title_promotion1,templer_desc_promotion1,Promotion,Templer,TemplerIncreaseStormSpeed,100,10,1,1,1,,None,번개 가속,번개 속도+100%
206132,templer_title_promotion2,templer_desc_promotion2,Promotion,Templer,TemplerAddStormPhantom,1,10,1,1,1,,None,환영 번개,환영 번개 추가<br>환영은 피해 25%<br>그 외 번개와 동일
206221,templer_title_chain3,templer_desc_chain3,Chain,Templer,TemplerIncreaseParalysisDuration,100,11,1,2,1,206121,None,마비 강화,사도가 가하는 [마비]<br>지속시간+100%
206222,templer_title_chain4,templer_desc_chain4,Chain,Templer,TemplerTriggerMiniStorm,1,11,1,2,18,206121,None,연쇄 번개,사도가 [마비] 부여 시<br>소형번개 발동<br>초당 1회
206223,templer_title_chain5,templer_desc_chain5,Chain,Templer,TemplerTriggerMiniLightningOnHit,10,11,1,2,6,206122,None,소형 번개+,번개 명중 시<br>소형번개 발사<br>최초 10회
206231,templer_title_promotion3,templer_desc_promotion3,Promotion,Templer,TemplerIncreaseAncientUnitSpeed,50,10,1,2,1,,None,사이오닉 가속,고대 유닛<br>쿨타임 가속+50%
206232,templer_title_promotion4,templer_desc_promotion4,Promotion,Templer,TemplerTriggerMiniLightningOnDamage,2,10,1,2,1,,None,잔류 번개,적이 번개 피격 후<br>2초 동안 피격 시<br>소형번개 발사<br>최소 간격 0.5초
206241,templer_title_combo1,templer_desc_combo1,Combo,Templer,TemplerTriggerLightningOnHit,50,10,1,2,1,,Marauder1,지뢰 번개,50% 확률로<br>번개 명중 시<br>부유지뢰 생성
206242,templer_title_combo2,templer_desc_combo2,Combo,Templer,TemplerAddRadiationTrailOnPath,2,10,1,2,1,,Vessel1,번개 낙진,번개 이동경로에<br>방사능 궤적 생성<br>2초간 지속
206321,templer_title_chain6,templer_desc_chain6,Chain,Templer,TemplerAddMaxHealthDamageOnParalysis,3,11,1,3,1,"206221,206222",None,번개 침투,번개가 [마비] 부여 시<br>적 최대 체력의 3%<br>추가 피해
206322,templer_title_chain7,templer_desc_chain7,Chain,Templer,"TemplerAddParalysisToMiniLightning,TemplerModifyMiniLightningDamage","1,100",11,1,3,10,206223,None,소형번개 마비,소형번개 명중 시<br>[마비] 부여<br>소형번개 피해+100%
206341,templer_title_combo3,templer_desc_combo3,Combo,Templer,TemplerAddKnockbackToAllLightning,5,10,1,3,1,,DrFrost2,번개 충격,50% 확률로<br>모든 번개 명중 시<br>적을 위로 날린다
206401,unit_title_arousal,unit_desc_arousal,Common,Templer,,,0,1,3,14,,None,각성 모드,최대 랭크가 되면 각성합니다.
207001,dragoon_title_spawn,dragoon_desc_spawn,Spawn,Dragoon,,,66,1,1,1,,None,거북이,고대타입<br>지속피해를 입히는<br>레이저 발사
207111,dragoon_title_common1,dragoon_desc_common1,Common,Dragoon,DragoonDecreaseLaserCooldown,30,33,3,1,1,,None,재충전,레이저<br>쿨타임 가속+30%
207112,dragoon_title_common2,dragoon_desc_common2,Common,Dragoon,DragoonIncreaseLaserDuration,40,33,3,1,1,,None,레이저 정렬,레이저<br>지속시간+40%
207113,dragoon_title_common3,dragoon_desc_common3,Common,Dragoon,DragoonIncreaseLaserDamage,50,33,3,1,1,,None,출력 증폭,레이저 피해+50%
207121,dragoon_title_chain1,dragoon_desc_chain1,Chain,Dragoon,DragoonStackDamageOnSameTarget,200,11,1,1,1,,None,레이저 응집,동일 목표 명중 시<br>피해 중첩<br>최대+200%
207122,dragoon_title_chain2,dragoon_desc_chain2,Chain,Dragoon,DragoonIncreaseRefractionCount,2,11,1,1,2,,None,굴절레이저,굴절레이저 생성<br>굴절+2
207131,dragoon_title_promotion1,dragoon_desc_promotion1,Promotion,Dragoon,DragoonDecreaseLaserInterval,40,10,1,1,1,,None,레이저 가속,레이저<br>피해간격-40%
207132,dragoon_title_promotion2,dragoon_desc_promotion2,Promotion,Dragoon,DragoonAddVulnerabilityOnHit,1,10,1,1,1,,None,취약 광선,레이저 명중 시<br>[취약] 부여
207221,dragoon_title_chain3,dragoon_desc_chain3,Chain,Dragoon,DragoonStackDamageOnTargetSwitch,1,11,1,2,1,207121,None,응집 유지,레이저 목표 전환 시<br>피해 중첩 누적
207222,dragoon_title_chain4,dragoon_desc_chain4,Chain,Dragoon,"DragoonIncreaseRefractionCount,DragoonPullEnemiesWithRefraction","2,0.25",11,1,2,6,207122,None,인력 굴절레이저,굴절+2<br>굴절레이저 명중 시<br>적을 끌어당김
207231,dragoon_title_promotion3,dragoon_desc_promotion3,Promotion,Dragoon,DragoonIncreaseStatsOnKill,10,10,1,2,1,,None,큰 거 한 방,처치 시 다음 레이저<br>지속시간+10%<br>쿨타임 증가+5%<br>최대 10중첩
207232,dragoon_title_promotion4,dragoon_desc_promotion4,Promotion,Dragoon,DragoonAddAuxiliaryLaser,1,10,1,2,1,,None,보조레이저,보조레이저 추가
207241,dragoon_title_combo1,dragoon_desc_combo1,Combo,Dragoon,DragoonTriggerExplosionOnDamage,1,10,1,2,1,,Turret1,폭발 레이저,피해를 입힐 때<br>폭발 추가
207242,dragoon_title_combo2,dragoon_desc_combo2,Combo,Dragoon,DragoonSpawnBlizzardOnTarget,1,10,1,2,18,,DrFrost1,서리 레이저,레이저 대상에<br>소형 눈보라 생성
207321,dragoon_title_chain5,dragoon_desc_chain5,Chain,Dragoon,DragoonStackDamageOnSameTarget,400,11,1,3,1,207221,None,레이저 응집+,피해 중첩 최대+400%
207322,dragoon_title_chain6,dragoon_desc_chain6,Chain,Dragoon,DragoonRefractionExplosion,1,11,1,3,10,207222,None,폭발 굴절레이저,굴절레이저가<br>피해를 입힐 때 폭발
207341,dragoon_title_combo3,dragoon_desc_combo3,Combo,Dragoon,DragoonTriggerMiniLightningOnMainHit,30,10,1,3,1,,Templer2,번개 레이저,30% 확률로 레이저가<br>피해를 입힐 때<br>소형번개 발사
207401,unit_title_arousal,unit_desc_arousal,Common,Dragoon,,,0,1,3,14,,None,각성 모드,최대 랭크가 되면 각성합니다.
208001,vessel_title_spawn,vessel_desc_spawn,Spawn,Vessel,,,66,1,1,1,,None,지우개,기계타입<br>지속피해를 가하는<br>방사능 방출<br>벽에 부딪히면 반사
208111,vessel_title_common1,vessel_desc_common1,Common,Vessel,VesselIncreaseVesselDamage,50,33,3,1,1,,None,피해 강화,피해+50%
208112,vessel_title_common2,vessel_desc_common2,Common,Vessel,VesselIncreaseVesselLifetime,30,33,3,1,1,,None,연료 충전,비행시간+30%
208113,vessel_title_common3,vessel_desc_common3,Common,Vessel,VesselIncreaseMovingVesselSize,25,33,3,1,1,,None,거대 지우개,지우개 크기+25%
208121,vessel_title_chain1,vessel_desc_chain1,Chain,Vessel,VesselAddSmallVessel,2,11,1,1,1,,None,드론 생산,3초마다 소형지우개 2기 소환
208122,vessel_title_chain2,vessel_desc_chain2,Chain,Vessel,VesselAddRadiationTrail,2,11,1,1,2,,None,낙진 형성,비행하면서<br>2초간 유지되는<br>방사능 궤적 형성
208131,vessel_title_promotion1,vessel_desc_promotion1,Promotion,Vessel,"VesselIncreaseVesselDamage,VesselIncreaseVesselSpeed","60,80",10,1,1,1,,None,항법 개선,피해+60%<br>피해를 입히지 않으면<br>비행속도+80%
208132,vessel_title_promotion2,vessel_desc_promotion2,Promotion,Vessel,VesselAddStationaryTime,10,10,1,1,1,,None,제자리 비행,비행시간 종료 시<br>10초간 제자리 비행
208221,vessel_title_chain3,vessel_desc_chain3,Chain,Vessel,VesselSpawnVesselOnKill,2,11,1,2,1,208121,None,추가 드론,적 2기 처치 시<br>소형지우개 2기 소환
208222,vessel_title_chain4,vessel_desc_chain4,Chain,Vessel,VesselIncreaseTrailDamage,60,11,1,2,6,208122,None,낙진 강화,궤적 피해+60%
208231,vessel_title_promotion3,vessel_desc_promotion3,Promotion,Vessel,VesselDecreaseCooldownOnKill,0.5,10,1,2,1,,None,재가동,적 2기 처치마다<br>다음 쿨타임-0.5초<br>최대 -5초
208232,vessel_title_promotion4,vessel_desc_promotion4,Promotion,Vessel,VesselIncreaseDamageOnHit,20,10,1,2,1,,None,피해 증폭,피해를 20회 입힐 때마다<br>피해+20%<br>최대+200%
208241,vessel_title_combo1,vessel_desc_combo1,Combo,Vessel,VesselTriggerShockwaveOnHit,20,10,1,2,18,,Templer1,충격파,피해를 20회 입힐 때마다<br>충격파 발사<br>[마비] 부여
208242,vessel_title_combo2,vessel_desc_combo2,Combo,Vessel,VesselAddIgniteOnHit,20,10,1,2,1,,Turret1,점화 방사능,20% 확률로<br>지우개 명중 시<br>[점화] 부여
208321,vessel_title_chain5,vessel_desc_chain5,Chain,Vessel,"VesselIncreaseSmallVesselDamage,VesselIncreaseSmallVesselLifetime","50,50",11,1,3,1,208221,None,드론 강화,소형지우개<br>피해+50%<br>비행시간+50%
208322,vessel_title_chain6,vessel_desc_chain6,Chain,Vessel,VesselIncreaseTrailDuration,2,11,1,3,14,208222,None,낙진 강화+,방사능 궤적<br>지속시간+2초
208341,vessel_title_combo3,vessel_desc_combo3,Combo,Vessel,VesselAddPenetratingShots,15,10,1,3,1,,Marauder2,산탄 지우개,피해를 15회 입힐 때마다<br>관통 산탄 발사
208401,unit_title_arousal,unit_desc_arousal,Common,Vessel,,,0,1,3,10,,None,각성 모드,최대 랭크가 되면 각성합니다.
209001,carrier_title_spawn,carrier_desc_spawn,Spawn,Carrier,,,66,1,1,1,,None,우주모함,고대타입<br>요격기를 내보내<br>적을 추적 및 공격
209111,carrier_title_common1,carrier_desc_common1,Common,Carrier,CarrierIncreaseInterceptorAttacks,2,33,3,1,1,,None,추가 요격,요격기 공격횟수+2
209112,carrier_title_common2,carrier_desc_common2,Common,Carrier,"CarrierIncreaseInterceptorCount,CommonDecreaseDamage","2,15",33,3,1,1,,None,추가 수용,요격기+2<br>피해-15%
209113,carrier_title_common3,carrier_desc_common3,Common,Carrier,CommonIncreaseDamage,50,33,3,1,1,,None,요격 강화,요격기 피해+50%
209121,carrier_title_chain1,carrier_desc_chain1,Chain,Carrier,CarrierAddPulseWave,1,11,1,1,1,,None,펄스파동,요격기부대 최초 공격 시<br>펄스파동 방출
209122,carrier_title_chain2,carrier_desc_chain2,Chain,Carrier,CarrierInterceptorSplitOnKill,1,11,1,1,2,,None,기체 분열,요격기 처치 후<br>1단계 1기로 분열<br>최대 1회
209131,carrier_title_promotion1,carrier_desc_promotion1,Promotion,Carrier,CarrierEvolveToStage2,3,10,1,1,1,,None,요격 강화,요격기 1단계<br>3회 공격 후<br>2단계로 진화
209132,carrier_title_promotion2,carrier_desc_promotion2,Promotion,Carrier,CarrierStage2PeriodicLaunch,1,10,1,1,1,,None,출격 강화,2회 출격마다<br>요격기 2단계 출격
209221,carrier_title_chain3,carrier_desc_chain3,Chain,Carrier,"CarrierIncreasePulseRadius,CarrierAddPulseSlowEffect","30,1",11,1,2,1,209121,None,감속 파동,펄스파동 범위+30%<br>[감속] 부여
209222,carrier_title_chain4,carrier_desc_chain4,Chain,Carrier,CarrierAddPulseOnLastAttack,1,11,1,2,1,209121,None,추가 파동,요격기부대 마지막 공격 후<br>펄스파동 방출
209223,carrier_title_chain5,carrier_desc_chain5,Chain,Carrier,CarrierInterceptorSplitOnKill,2,11,1,2,6,209122,None,강화 분열,요격기 처치 후<br>2단계 1기로 분열<br>최대 1회
209231,carrier_title_promotion3,carrier_desc_promotion3,Promotion,Carrier,CarrierEvolveToStage3,3,10,1,2,1,,None,요격 강화+,요격기 2단계<br>3회 공격 후<br>3단계로 진화
209232,carrier_title_promotion4,carrier_desc_promotion4,Promotion,Carrier,CarrierAddInterceptorOnReturn,50,10,1,2,14,,None,재활용,요격기 귀환 후<br>다음 출격 시<br>추가 요격기 출격<br>최대 5기 확률 50%
209233,carrier_title_promotion5,carrier_desc_promotion5,Promotion,Carrier,CarrierStage3PeriodicLaunch,50,10,1,2,1,,Marauder1,출격 강화+,2회 출격마다<br>50% 확률로<br>요격기 3단계 출격
209241,carrier_title_combo1,carrier_desc_combo1,Combo,Carrier,CarrierInterceptorWrathLightning,50,10,1,2,1,,Thor1,뇌격 요격,50% 확률로<br>요격기 공격 시<br>뇌격 방출
209321,carrier_title_chain6,carrier_desc_chain6,Chain,Carrier,CarrierInterceptorSplitOnKill,3,11,1,3,10,209223,None,최종 분열,요격기 처치 후<br>3단계 1기로 분열<br>최대 1회
209341,carrier_title_combo2,carrier_desc_combo2,Combo,Carrier,CarrierIncreaseInterceptorProjectiles,1,10,1,3,1,,Marine1,요격 탄환 추가,요격기 탄환+1
209342,carrier_title_combo3,carrier_desc_combo3,Combo,Carrier,CarrierInterceptorDamageStack,30,10,1,3,1,,Dragoon2,요격 성능 개선,요격기 공격 후<br>해당 요격기<br>피해+30%
209401,unit_title_arousal,unit_desc_arousal,Common,Carrier,,,0,1,3,18,,None,각성 모드,최대 랭크가 되면 각성합니다.
210001,ninja_title_spawn,ninja_desc_spawn,Spawn,Ninja,,,66,1,1,1,,None,어쌔신,인간타입<br>적의 뒤로 접근하여 여러 번 공격
210111,ninja_title_common1,ninja_desc_common1,Common,Ninja,CommonIncreaseDamage,50,33,3,1,1,,None,암살 강화,피해+50%
210112,ninja_title_common2,ninja_desc_common2,Common,Ninja,"NinjaAddMainAttack, CommonDecreaseDamage","1,15",33,3,1,1,,None,그림자 분신,어쌔신+1<br>피해-15%
210113,ninja_title_common3,ninja_desc_common3,Common,Ninja,"NinjaIncreaseExtraAttackLimit,CommonIncreaseDamage","1,30",33,3,1,1,,None,연속 공격,공격 한도+1<br>피해+30%
210121,ninja_title_chain1,ninja_desc_chain1,Chain,Ninja,NinjaThrowShurikenAfterAttack,20,11,1,1,1,,None,수리검 난사,공격 후 수리검 2개 투척<br>20% 확률로 수리검+2
210122,ninja_title_chain2,ninja_desc_chain2,Chain,Ninja,NinjaAddExplosionOnAttack,1,11,1,1,2,,None,기폭 암살,공격 시 폭발
210131,ninja_title_promotion1,ninja_desc_promotion1,Promotion,Ninja,"NinjaIncreaseExtraAttackLimit,CommonIncreaseDamage","3,100",10,1,1,1,,None,폭주,공격 한도+3<br>피해+100%
210132,ninja_title_promotion2,ninja_desc_promotion2,Promotion,Ninja,NinjaEnemyHealthBasedDamage,150,10,1,1,1,,None,강강약강,적 현재 체력 비례<br>피해 증가<br>최대+150%
210221,ninja_title_chain3,ninja_desc_chain3,Chain,Ninja,NinjaShurikenSplitChance,20,11,1,2,1,210121,None,수리검 분리,수리검 명중 시<br>소형수리검 2개 분리<br>20% 확률로 소형수리검+2
210222,ninja_title_chain4,ninja_desc_chain4,Chain,Ninja,NinjaIncreaseExplosionRadius,20,11,1,2,6,210122,None,기폭 강화 1형,어쌔신 공격 시<br>폭발범위+20%
210223,ninja_title_chain5,ninja_desc_chain5,Chain,Ninja,NinjaIncreaseExplosionDamage,20,11,1,2,10,210122,None,기폭 강화 2형,어쌔신 공격 시<br>폭발피해+20%
210231,ninja_title_promotion3,ninja_desc_promotion3,Promotion,Ninja,"CommonIncreaseDamage, NinjaIncreaseCriticalChance","40,30",10,1,2,1,,None,치명적인 일격,피해+40%<br>치명타율+30%
210232,ninja_title_promotion4,ninja_desc_promotion4,Promotion,Ninja,NinjaIncreaseDamageOnKill,500,10,1,2,1,,None,학살,적 처치 시 피해+100%<br>최대+500%
210241,ninja_title_combo1,ninja_desc_combo1,Combo,Ninja,NinjaAddWeaknessDebuff,1,10,1,2,1,,Marine1,약점 노출,공격 시 [약점: 인간] 부여
210242,ninja_title_combo2,ninja_desc_combo2,Combo,Ninja,NinjaCreateWrathLightningOnKill,50,10,1,2,18,,Thor1,뇌절,50% 확률로 적 처치 시<br>뇌격 방출
210321,ninja_title_chain6,ninja_desc_chain6,Chain,Ninja,NinjaIncreaseAllShurikenSplitChance,40,11,1,3,1,210221,None,분리 강화,모든 수리검<br>분리 확률+40%
210341,ninja_title_combo3,ninja_desc_combo3,Combo,Ninja,NinjaPlaceFloatingMineOnAttack,1,10,1,3,1,,Marauder2,암살 지뢰,공격 시 부유지뢰 설치
210401,unit_title_arousal,unit_desc_arousal,Common,Ninja,,,0,1,3,14,,None,각성 모드,최대 랭크가 되면 각성합니다.
211001,thor_title_spawn,thor_desc_spawn,Spawn,Thor,,,66,1,1,1,,None,또르,고대타입<br>전격을 두른 망치로 폭발피해
211111,thor_title_common1,thor_desc_common1,Common,Thor,CommonIncreaseDamage,50,33,3,1,1,,None,출력 증폭,피해+50%
211112,thor_title_common2,thor_desc_common2,Common,Thor,"ThorIncreaseHammerBounceCount,CommonDecreaseDamage","1,15",33,3,1,1,,None,전이 강화,전이+1 피해-15%
211113,thor_title_common3,thor_desc_common3,Common,Thor,CommonDecreaseCooltime,30,33,3,1,1,,None,충전 가속,쿨타임 가속+30%
211121,thor_title_chain1,thor_desc_chain1,Chain,Thor,"ThorIncreaseChargingTime, ThorChargingTimeBasedExplosionRadius",0.5,11,1,1,1,,None,추가 충전,충전시간+0.5초<br>충전시간 비례 폭발범위 증가
211122,thor_title_chain2,thor_desc_chain2,Chain,Thor,ThorCreateLightningFieldAfterExplosion,2,11,1,1,2,,None,번개 장판,폭발 후<br>지속피해를 입히는<br>번개 장판 생성<br>[감속] 부여<br>2초간 지속
211131,thor_title_promotion1,thor_desc_promotion1,Promotion,Thor,ThorCreateWrathLightningOnHit,5,10,1,1,1,,None,뇌격 방출,명중 시 뇌격 방출<br>최대 5개
211132,thor_title_promotion2,thor_desc_promotion2,Promotion,Thor,ThorIncreaseExplosionRadiusAndParalysis,30,10,1,1,1,,None,마비 충격,폭발범위+30%<br>공격과 번개 장판 [마비] 부여
211221,thor_title_chain3,thor_desc_chain3,Chain,Thor,ThorIncreaseChargingTime,0.5,11,1,2,1,211121,None,추가 충전+,충전시간+0.5초
211222,thor_title_chain4,thor_desc_chain4,Chain,Thor,"ThorIncreaseLightningFieldDamage,ThorIncreaseLightningFieldDuration","100,1",11,1,2,6,211122,None,장판 강화,번개 장판<br>피해+100%<br>지속시간+1초
211231,thor_title_promotion3,thor_desc_promotion3,Promotion,Thor,ThorIncreaseLightningFieldSizeAndReduceOuterDamage,50,10,1,2,1,,None,폭발 확장,폭발범위+100%<br>외곽 피해량-50%
211232,thor_title_promotion4,thor_desc_promotion4,Promotion,Thor,ThorCreateWrathLightningWhileCharging,2,10,1,2,1,,None,충전형 뇌격,충전 중 0.25초마다<br>뇌격 방출 최대 2개
211241,thor_title_combo1,thor_desc_combo1,Combo,Thor,ThorCreateRefractionLaserWhileCharging,2,10,1,2,1,,Dragoon1,충전형 레이저,충전 중 굴절레이저 2개 발사
211321,thor_title_chain5,thor_desc_chain5,Chain,Thor,ThorIncreaseChargingTime,1,11,1,3,1,211221,None,추가 충전++,충전시간+1초
211322,thor_title_chain6,thor_desc_chain6,Chain,Thor,ThorCreateWrathLightningFromField,0.5,11,1,3,10,211222,None,장판 방출,0.5초마다 번개 장판에서<br>뇌격 방출
211341,thor_title_combo2,thor_desc_combo2,Combo,Thor,ThorCreateMiniLightningOnAttack,5,10,1,3,1,,Templer1,번개 방출,폭발 시 피격된 적에서<br>소형번개 발사 최대 5개
211342,thor_title_combo3,thor_desc_combo3,Combo,Thor,ThorCreateRuptureLaserOnHit,100,10,1,3,14,,Archon2,파열방출,폭발 시 파열광선 생성
211401,unit_title_arousal,unit_desc_arousal,Common,Thor,,,0,1,3,18,,None,각성 모드,최대 랭크가 되면 각성합니다.
212001,airman_title_spawn,airman_desc_spawn,Spawn,AirMan,,,66,1,1,1,,None,바람돌이,적들을 끌어당기는<br>소용돌이 발사
212111,airman_title_common1,airman_desc_common1,Common,AirMan,AirManIncreaseDamage,50,33,3,1,1,,None,강풍,피해+50%
212112,airman_title_common2,airman_desc_common2,Common,AirMan,AirManIncreaseRange,25,33,3,1,1,,None,돌개바람,범위+25%
212113,airman_title_common3,airman_desc_common3,Common,AirMan,AirManIncreaseDistance,30,33,3,1,1,,None,순풍,이동거리+30%
212121,airman_title_chain1,airman_desc_chain1,Chain,AirMan,AirManAddJetStream,0.25,11,1,1,1,,None,제트기류,처음 적이 닿은 지점부터<br>소멸 지점을 잇는<br>제트기류 생성<br>적 끌어당김<br>3초간 지속
212122,airman_title_chain2,airman_desc_chain2,Chain,AirMan,AirManCreateWhirlpoolOnExpire,1,11,1,1,2,,None,소용돌이,소멸 시<br>회오리 생성<br>5초간 지속
212131,airman_title_promotion1,airman_desc_promotion1,Promotion,AirMan,AirManRangeIncreaseByDistance,5,10,1,1,1,,None,바람 확장,이동거리 비례<br>범위 증가
212132,airman_title_promotion2,airman_desc_promotion2,Promotion,AirMan,"AirManIncreaseDamage,AirManIncreaseTractionForce","80,100",10,1,1,1,,None,폭풍 강화,피해+80%<br>인력+100%
212221,airman_title_chain3,airman_desc_chain3,Chain,AirMan,AirManIncreaseJetStreamDuration,100,11,1,2,1,212121,None,지속기류,제트기류 지속시간+100%
212222,airman_title_chain4,airman_desc_chain4,Chain,AirMan,AirManIncreaseJetStreamWidth,100,11,1,2,1,212121,None,확장기류,제트기류 입구 범위+100%
212223,airman_title_chain5,airman_desc_chain5,Chain,AirMan,"AirManIncreaseWhirlpoolRange,AirManIncreaseWhirlpoolTraction","50,50",11,1,2,6,212122,None,폭풍 흡수,회오리 범위+50%<br>인력+50%
212231,airman_title_promotion3,airman_desc_promotion3,Promotion,AirMan,AirManAddAdditionalAttacks,1,10,1,2,1,,None,쌍태풍,태풍 추가 발사
212232,airman_title_promotion4,airman_desc_promotion4,Promotion,AirMan,AirManMultiplyDistanceFinal,2,10,1,2,1,,None,질풍,이동거리 2배
212241,airman_title_combo1,airman_desc_combo1,Combo,AirMan,AirManAddWallReflection,3,10,1,2,1,,Vessel1,반사 폭풍,태풍 반사 가능
212242,airman_title_combo2,airman_desc_combo2,Combo,AirMan,AirManAddDisruptDebuff,1,10,1,2,1,,DrFrost1,와해 폭풍,태풍이<br>피해를 입힐 때<br>[와해] 부여
212321,airman_title_chain6,airman_desc_chain6,Chain,AirMan,AirManIncreaseWhirlpoolDamage,250,11,1,3,14,212223,None,광풍,회오리 피해+250%
212341,airman_title_combo3,airman_desc_combo3,Combo,AirMan,AirManCreateWrathLightningWhileMoving,1,10,1,3,18,,Thor2,뇌풍,태풍 이동 중<br>1초마다 뇌격 방출<br>1회당 최대 5개
212401,unit_title_arousal,unit_desc_arousal,Common,AirMan,,,0,1,3,10,,None,각성 모드,최대 랭크가 되면 각성합니다.`;

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function parseCards(): CardData[] {
  const lines = rawData.split('\n');
  const cards: CardData[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    const parts = parseCSVLine(line);
    if (parts.length < 15) continue;

    const [
      cardIDStr,
      cardName,
      cardDescription,
      cardType,
      targetUnit,
      effectTypesStr,
      effectValuesStr,
      weightStr,
      maxCountStr,
      cardRankStr,
      unitLevelLimitStr,
      parentCardIDsStr,
      combineCondition,
      displayName,
      displayDescription
    ] = parts;

    const cardID = parseInt(cardIDStr, 10);
    if (isNaN(cardID)) continue;

    const effectTypes = effectTypesStr ? effectTypesStr.split(',').map(s => s.trim()) : [];
    const effectValues = effectValuesStr
      ? effectValuesStr.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n))
      : [];

    const parentCardIDs = parentCardIDsStr
      ? parentCardIDsStr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n))
      : [];

    cards.push({
      cardID,
      cardName,
      cardDescription,
      cardType: cardType as ECardType,
      targetUnit: targetUnit as EUnitType,
      effectTypes,
      effectValues,
      weight: parseInt(weightStr, 10) || 0,
      maxCount: parseInt(maxCountStr, 10) || 0,
      cardRank: parseInt(cardRankStr, 10) || 1,
      unitLevelLimit: parseInt(unitLevelLimitStr, 10) || 1,
      parentCardIDs,
      combineCondition: combineCondition || 'None',
      displayName: displayName || cardName,
      displayDescription: (displayDescription || '').replace(/<br>/g, '\n').replace(/<[^>]*>/g, '')
    });
  }

  return cards;
}

export const cardData: CardData[] = parseCards();

export function getCardsByUnit(unit: EUnitType): CardData[] {
  return cardData.filter(card => card.targetUnit === unit);
}

export function getCardById(id: number): CardData | undefined {
  return cardData.find(card => card.cardID === id);
}

export function getChainCards(unit: EUnitType): CardData[] {
  return cardData.filter(card => card.targetUnit === unit && card.cardType === 'Chain');
}

export function getComboCards(unit: EUnitType): CardData[] {
  return cardData.filter(card => card.targetUnit === unit && card.cardType === 'Combo');
}

export function getAllUnits(): EUnitType[] {
  const units = new Set<EUnitType>();
  cardData.forEach(card => units.add(card.targetUnit));
  return Array.from(units);
}
