import { ForbiddenError, NotFoundError } from "../errors/error";
import type { WorkoutRepository } from "../repositories/workout-repository";

interface Input {
  userId: string;
  workoutPlanId: string;
  workoutDayId: string;
  workoutSessionId: string;
  completedAt: string;
}

interface Output {
  id: string;
  completedAt: string;
  startedAt: string;
}

export class UpdateWorkoutSession {
  constructor(private repository: WorkoutRepository) {}

  async execute(data: Input): Promise<Output> {
    const owner = await this.repository.findWorkoutSessionOwner({
      workoutPlanId: data.workoutPlanId,
      workoutDayId: data.workoutDayId,
      workoutSessionId: data.workoutSessionId,
    });

    if (!owner) {
      throw new NotFoundError("Workout session not found for this workout day");
    }

    if (owner.userId !== data.userId) {
      throw new ForbiddenError(
        "You can only update sessions for your own workout plan",
      );
    }

    const workoutSession = await this.repository.updateWorkoutSession({
      workoutSessionId: data.workoutSessionId,
      completedAt: new Date(data.completedAt),
    });

    return {
      id: workoutSession.id,
      completedAt: workoutSession.completedAt.toISOString(),
      startedAt: workoutSession.startedAt.toISOString(),
    };
  }
}
