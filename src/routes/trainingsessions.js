import express from "express";
import { dataSource } from "../db/db.js";
import Trainingsession from "../entities/trainingsession.js";
import Exercise from "../entities/exercise.js";
import Set from "../entities/set.js";
import { verifyToken } from "../middleware/authController.js"

const router = express.Router();

// GET route for retrieving a training session
router.get('/:sessionId', verifyToken, async (req, res) => {
  try {
    // Extract user ID from JWT token
    const userId = req.user.userId;

    // Retrieve session ID from request parameters
    const sessionId = req.params.sessionId;
    console.log("userid: "+userId+ " sessionId: "+ sessionId);
    // Query the database to retrieve the training session
    const session = await dataSource.getRepository(Trainingsession).findOne({ where: { id: sessionId}});

    // Check if session exists and belongs to the current user
    if (!session) {
      return res.status(404).json({ message: 'Training session not found or unauthorized' });
    }

    // Return the session data
    res.json(session);
  } catch (error) {
    console.error('Error retrieving training session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/trainingsession/user/:userId
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the last 7 training sessions for the specified user along with exercises and sets
    const trainingsessions = await dataSource
      .getRepository(Trainingsession)
      .createQueryBuilder("trainingsession")
      .leftJoinAndSelect("trainingsession.exercises", "exercise")
      .leftJoinAndSelect("exercise.sets", "set")
      .where("trainingsession.user_id = :userId", { userId })
      .orderBy("trainingsession.id", "DESC")
      .take(5)
      .getMany();

    // Serialize the training sessions objects
    const serializedTrainingsessions = trainingsessions.map(
      (trainingsession) => ({
        id: trainingsession.id,
        name: trainingsession.name,
        date: trainingsession.date,
        duration: trainingsession.duration,
        exercises: trainingsession.exercises.map((exercise) => ({
          id: exercise.id,
          name: exercise.name,
          sets: exercise.sets.map((set) => ({
            id: set.id,
            reps: set.reps,
            weight: set.weight,
          })),
        })),
      })
    );

    res.json(serializedTrainingsessions);
  } catch (error) {
    console.error("Error fetching training sessions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, name, date, duration, exercises } = req.body;

    // Validate incoming data
    if (!userId || !name || !date || !duration || !exercises || !Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Save training session to the database
    const newTrainingSession = await dataSource
      .getRepository(Trainingsession)
      .save({
        user_id: userId,
        name: name,
        date: date,
        duration: duration,
        exercises: exercises,
      });

    // Save exercises and sets
    for (const exercise of exercises) {
      const { name: exerciseName, sets } = exercise;
      const newExercise = await dataSource.getRepository(Exercise).save({
        trainingsession_id: newTrainingSession.id,
        name: exerciseName,
      });

      for (const set of sets) {
        await dataSource.getRepository(Set).save({
          exercise_id: newExercise.id,
          reps: set.reps,
          weight: set.weight,
        });
      }
    }

    res.status(201).json({ message: "Training session created successfully" });
  } catch (error) {
    console.error("Error creating training session: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
