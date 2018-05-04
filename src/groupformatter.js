import axios from './myaxios'
import store from './store'

export default function(group) {
    group.edit = false
    group.editinput = ""
    group.selected = null
    group.options = [
      { value: null, text: "-- Select Existing Exercise --" }
    ]
    axios.get('api/distinctexercises', store.getters.getAuthConfig)
    .then(function(response){
      const data = response.data
      data.forEach(function(x){
        group.options.push({value: x.Id, text: x.Name})
      })
    })
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
      e.editExercise = {
        Id: e.Id,
        Name: e.Name,
        Sets: e.Sets,
        MinReps: e.MinReps,
        MaxReps: e.MaxReps,
        Rest: e.Rest,
        Note: e.Note,
        WebLink: e.WebLink,
        GroupId: group.Id
      }
    })
    return group
}