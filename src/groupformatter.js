export default function(group) {
    group.edit = false
    group.editinput = ""
    group.newExercise = {
      Id: 0,
      Name: "",
      Sets: 1,
      MinReps: 10,
      MaxReps: 12,
      Rest: 90,
      Note: "",
      WebLink: "",
      GroupId: group.Id
    }
    group.Exercises.forEach(function(e){
      e.edit = false
    })
    return group
}