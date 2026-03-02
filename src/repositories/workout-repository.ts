export interface CreateWorkoutPlanDTO {
  name: string;
  userId: string;
  workoutDays: {
    weekDay: string;
    isRest: boolean;
    estimatedDurationInSeconds: number;
    coverImageUrl?: string;
    exercises: {
      order: number;
      name: string;
      sets: number;
      reps: number;
      restTimeInSeconds: number;
    }[];
  }[];
}

export interface FindWorkoutDayOwnerDTO {
  workoutPlanId: string;
  workoutDayId: string;
}

export interface StartWorkoutSessionDTO {
  workoutDayId: string;
}

export interface FindWorkoutSessionOwnerDTO {
  workoutPlanId: string;
  workoutDayId: string;
  workoutSessionId: string;
}

export interface UpdateWorkoutSessionDTO {
  workoutSessionId: string;
  completedAt: Date;
}

export interface WorkoutRepository {
  create(data: CreateWorkoutPlanDTO): Promise<{ id: string }>;
  findActiveByUserId(userId: string): Promise<{ id: string } | null>;
  findWorkoutDayOwner(
    data: FindWorkoutDayOwnerDTO,
  ): Promise<{ userId: string } | null>;
  findStartedSessionByWorkoutDayId(
    workoutDayId: string,
  ): Promise<{ id: string } | null>;
  startWorkoutSession(data: StartWorkoutSessionDTO): Promise<{ id: string }>;
  findWorkoutSessionOwner(
    data: FindWorkoutSessionOwnerDTO,
  ): Promise<{ userId: string } | null>;
  updateWorkoutSession(data: UpdateWorkoutSessionDTO): Promise<{
    id: string;
    completedAt: Date;
    startedAt: Date;
  }>;
}
