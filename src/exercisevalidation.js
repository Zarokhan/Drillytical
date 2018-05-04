export default function(exercise) {
    if (typeof exercise.MaxReps == "string") {
        exercise.MaxReps = TryParseInt(exercise.MaxReps, 0)
    }
    if (typeof exercise.MinReps == "string") {
        exercise.MinReps = TryParseInt(exercise.MinReps, 0)
    }
    if (typeof exercise.Sets == "string") {
        exercise.Sets = TryParseInt(exercise.Sets, 0)
    }
    if (typeof exercise.Rest == "string") {
        exercise.Rest = TryParseInt(exercise.Rest, 0)
    }
    return exercise
}

function TryParseInt(str,defaultValue) {
    var retValue = defaultValue;
    if(str !== null) {
        if(str.length > 0) {
            if (!isNaN(str)) {
                retValue = parseInt(str);
            }
        }
    }
    return retValue;
}