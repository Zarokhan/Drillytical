export default function(exercise) {
    if (typeof exercise.MaxReps == "string") {
        exercise.MaxReps = 0
    }
    if (typeof exercise.MinReps == "string") {
        exercise.MinReps = 0
    }
    if (typeof exercise.Sets == "string") {
        exercise.Sets = 0
    }
    if (typeof exercise.Rest == "string") {
        exercise.Rest = 0
    }
    return exercise
}