// Set Entity Schema
import { EntitySchema } from "typeorm";
import Exercise from "./exercise.js";

export default new EntitySchema({
  name: "Set",
  tableName: "sets",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    exercise_id: {
      type: "int",
      nullable: false,
    },
    reps: {
      type: "int",
      nullable: false,
    },
    weight: {
      type: "numeric",
      nullable: false,
    },
  },
  relations: {
    exercise: {
      type: "many-to-one",
      target: Exercise,
      joinColumn: {
        name: "exercise_id",
        referencedColumnName: "id",
      },
    },
  },
});
