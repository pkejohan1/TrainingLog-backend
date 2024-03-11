// Trainingsession Entity Schema
import { EntitySchema } from "typeorm";
import User from "./user.js";

export default new EntitySchema({
  name: "Trainingsession",
  tableName: "trainingsessions",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    user_id: {
      type: "int",
      nullable: false,
    },
    name: {
      type: "text",
      nullable: false,
    },
    date: {
      type: "timestamp without time zone",
    },
    duration: {
      type: "interval",
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: User,
      joinColumn: {
        name: "user_id",
        referencedColumnName: "id",
      },
    },
    exercises: {
      type: "one-to-many",
      target: "Exercise",
      inverseSide: "trainingsession",
    },
  },
});
