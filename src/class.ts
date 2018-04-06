//  tslint:disable:max-classes-per-file
export class Class {
    public id: string;
    public name: string;
    public features: Feature[];
    public subclasses: SubClasses;
    public hitDie: HitDie;
    public startingEquipment: Array<Option<Equipment>> = [];

    public getFeaturesAtLevel(level: number, subClass: string): Feature[] {
        let feats: Feature[] = this.features.filter(f => f.level === level);

        if (subClass && this.subclasses.has(subClass)) {
            feats = feats.concat((this.subclasses.get(subClass) as SubClass).features.filter(f => f.level === level));
        }

        return feats;
    }

    public getFeaturesForLevel(level: number, subClass: string): Feature[] {
        let feats: Feature[] = this.features.filter(f => f.level <= level);

        if (subClass && this.subclasses.has(subClass)) {
            feats = feats.concat((this.subclasses.get(subClass) as SubClass).features.filter(f => f.level <= level));
        }

        return feats;
    }
}

export type SubClasses = Map<string, SubClass>;

export class SubClass {
    public id: string;
    public name: string;
    public class: string;
    public features: Feature[];
}

export class Feature {
    public name: string;
    public effect: Array<Option<Effect>>;
    public level: number;
    public description: string;
}

export class Race {
    public name: string;
    public features: Feature[];
    public description: string;
    public age: string;
    public alignments: string;
    public size: string;
    public speed: number;
}

export type Option<T> = T | OptionChoice<T>;

export class OptionChoice<T> implements Effect {
    public type = EffectType.Option;
    public options: T[];
    public choose: number;
    public exclusive: boolean;
}

export class EffectHelper {
    public isScoreAdjustment(effect: Effect): effect is ScoreAdjustmentEffect {
        return effect.type === EffectType.ScoreAdjustment;
    }
    public isProficiency(effect: Effect): effect is ProficiencyEffect {
        return effect.type === EffectType.Proficiency;
    }
    public isResistance(effect: Effect): effect is ResistanceEffect {
        return effect.type === EffectType.Resistance;
    }
    public isAdvantage(effect: Effect): effect is AdvantageEffect {
        return effect.type === EffectType.Advantage;
    }
    public isClassResource(effect: Effect): effect is ClassResourceEffect {
        return effect.type === EffectType.ClassResource;
    }
    public isAttack(effect: Effect): effect is AttackEffect {
        return effect.type === EffectType.Attack;
    }
}

export interface Effect {
    type: EffectType;
}

export interface ScoreAdjustmentEffect extends Effect {
    adjustmentType: AdjustmentType;
    property: any;
    value: number;
}

export interface ProficiencyEffect extends Effect {
    proficiency: ProficiencyType;
    property: any;
}

export interface ResistanceEffect extends Effect {
    resistance: ResistanceType;
    damageType: string;
}

export interface AdvantageEffect extends Effect {
    advantage: AdvantageType;
    property: any;
}

export interface ClassResourceEffect extends Effect {
    resource: ClassResource;
    adjustmentType: AdjustmentType;
    value: number;
}

export interface AttackEffect extends Effect {
    name: string;
    toHitModifier: string;
    damageRoll: string;
}

export enum Ability {
    Str,
    Dex,
    Con,
    Wis,
    Int,
    Cha,
}

export interface Skill {
    name: string;
    ability: Ability;
}

export enum HitDie {
    d6 = 6,
    d8 = 8,
    d10 = 10,
    d12 = 12,
}

export enum EffectType {
    Option,
    ScoreAdjustment,
    Proficiency,
    Advantage,
    Resistance,
    ClassResource,
    Attack,
}

export enum ResistanceType {
    Resistance,
    Vulnerability,
    Immunity,
}

export enum AdjustmentType {
    BaseValue,
    Add,
    Multiply,
    Min,
    Max,
    Passive,
    Conditional,
}

export enum AdvantageType {
    Advantage,
    Disadvantage,
    AutoFail,
}

export enum ProficiencyType {
    HalfProficiency,
    Proficiency,
    DoubleProficiency,
}
