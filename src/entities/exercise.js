// Exercise Entity Schema
import { EntitySchema } from "typeorm";
import Trainingsession from "./trainingsession.js";

export default new EntitySchema({
  name: "Exercise",
  tableName: "exercises",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    trainingsession_id: {
      type: "int",
      nullable: false,
    },
    name: {
      type: "text",
      nullable: false,
    },
  },
  relations: {
    trainingsession: {
      type: "many-to-one",
      target: Trainingsession,
      joinColumn: {
        name: "trainingsession_id",
        referencedColumnName: "id",
      },
    },
    sets: {
      type: "one-to-many",
      target: "Set",
      inverseSide: "exercise",
    },
  },
});
