import { PrismaWorkoutRepository } from "../../repositories/prisma/PrismaWorkoutRepository";
import { UpdateWorkoutSession } from "../UpdateWorkoutSession";

export function makeUpdateWorkoutSession() {
  return new UpdateWorkoutSession(new PrismaWorkoutRepository());
}
