import { Ability, Effect, Class, Feature, Option, HitDie } from './class';
import { Money } from './money';
export class Character {
    baseScores: Map<Ability, number> = DefaultAbilityScores;
    abilityScores: Map<Ability, CharacterAbility> = new Map<Ability, CharacterAbility>();
    classes: ClassSelection[];
    hitDice: Map<HitDie, number> = new Map<HitDie, number>();
    equipment: Equipment[];
    money: Money;
    spellSlots: Map<number, number>() = new Map<number, number>();

    recalculateAbilityScore(ability: Ability): void {
        //  TODO
    }

    getAbilityScore(ability: Ability): number {
        if (!this.abilityScores.has(ability)) { return 10; }
        return (this.abilityScores.get(ability) as CharacterAbility).currentValue;
    }

    getAbilityMod(ability: Ability): number {
        if (!this.abilityScores.has(ability)) { return 0; }
        return (this.abilityScores.get(ability) as CharacterAbility).currentModifier;
    }
}

const DefaultAbilityScores = new Map<Ability, number>([
    [Ability.Str, 10],
    [Ability.Dex, 10],
    [Ability.Con, 10],
    [Ability.Int, 10],
    [Ability.Wis, 10],
    [Ability.Cha, 10],
]);

export class CharacterAbility {
    currentValue: number;
    currentModifier: number;
    ability: Ability;
    modifiers: Effect[] = [];
    calculated: boolean = true;
    baseValue: number;
}

export interface ClassSelection {
    classId: string;
    class: Class;
    levels: number;
    features: FeatureChoice[];
}

export interface FeatureChoice {
    featureId: string;
    feature: Feature;
    effectChoice: EffectChoice;
}

export interface EffectChoice {
    effectId: string;
    originalEffects: Option<Effect>;
    chosenEffects: Effect;
}