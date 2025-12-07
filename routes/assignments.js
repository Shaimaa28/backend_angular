let Assignment = require('../model/assignment');

// Récupérer tous les assignments (GET)
function getAssignments(req, res){
    Assignment.find((err, assignments) => {
        if(err){
            res.send(err)
        }

        res.send(assignments);
    });
}

// Récupérer les assignments avec pagination (GET)
function getAssignmentsPagine(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const aggregateQuery = Assignment.aggregate([
        { $sort: { dateDeRendu: -1 } }
    ]);

    Assignment.aggregatePaginate(
        aggregateQuery,
        {
            page: page,
            limit: limit
        },
        (err, assignments) => {
            if (err) {
                res.send(err);
            } else {
                res.send(assignments);
            }
        }
    );
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res){
    let assignmentId = req.params.id;

    Assignment.findOne({id: assignmentId}, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
    })
}

// Ajout d'un assignment (POST)
function postAssignment(req, res){
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save( (err) => {
        if(err){
            res.send('cant post assignment ', err);
        }
        res.json({ message: `${assignment.nom} saved!`})
    })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: 'updated'})
        }

      // console.log('updated ', assignment)
    });

}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {

    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${assignment.nom} deleted`});
    })
}

// Suppression de tous les assignments (DELETE)
function deleteAllAssignments(req, res) {
    Assignment.deleteMany({}, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.json({
                message: `${result.deletedCount} assignments supprimés`,
                deletedCount: result.deletedCount
            });
        }
    });
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment, deleteAllAssignments, getAssignmentsPagine };
