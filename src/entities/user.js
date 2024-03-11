// User Entity Schema
import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    username: {
      type: "varchar",
      nullable: false,
    },
    email: {
      type: "varchar",
      nullable: false,
    },
    password: {
      type: "varchar",
      nullable: false,
    },
  },
  relations: {
    trainingsessions: {
      type: "one-to-many",
      target: "Trainingsession",
      inverseSide: "user",
    },
  },
});
