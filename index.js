import { ApolloServer, gql, UserInputError } from 'apollo-server'
import {v1 as uuid} from 'uuid'

const alumnos = [ //Notiene phone
  {
    name: "Julio",
    lastname: "Ramirez",
    mail: "julioramirez@gmail.com",
    street: "San Martin 123",
    city: "Buenos Aires",
    id: "3f6b7e90-4c2a-11ed-bdc3-0242ac120002"
  },
  {
    name: "Ana",
    lastname: "González",
    mail: "anagonzalez@mail.com",
    phone: "+54 9 11 2345 6789",
    street: "Av. Colón 456",
    city: "Córdoba",
    id: "4a7c8f21-6d8b-11ed-bdc3-0242ac120002"
  },
  {
    name: "Carlos",
    lastname: "López",
    mail: "carloslopez@mail.com",
    phone: "+54 9 11 3456 7890",
    street: "Diagonal 74 1120",
    city: "La Plata",
    id: "5d9e7b43-8f9c-11ed-bdc3-0242ac120002"
  },
  {
    name: "María",
    lastname: "Fernández",
    mail: "mariafernandez@mail.com",
    phone: "+54 9 11 4567 8901",
    street: "Gral. Paz 987",
    city: "Tucumán",
    id: "6f1b9d65-9e0d-11ed-bdc3-0242ac120002"
  },
  {
    name: "Lucas",
    lastname: "Pérez",
    mail: "lucasperez@mail.com",
    phone: "+54 9 11 5678 9012",
    street: "Belgrano 2020",
    city: "Mendoza",
    id: "7a2c0f87-af1e-11ed-bdc3-0242ac120002"
  }
];

//CRUD -> Query para get y Mutation para post, put, delete
const definicion = gql`

    type Address{
        street: String!
        city: String!    
    }

    type Alumno{
        name: String!
        lastname: String!
        mail: String!
        phone: String
        address: Address!
        id: ID!
    }
    
    type Query {
        alumnoCount: Int!
        findAlumno(name: String!): Alumno
        allAlumnos: [Alumno]!
    }
    
    type Mutation{
        addAlumno(
            name: String!
            lastname: String!
            mail: String!
            phone: String
            street: String!
            city: String!
        ): Alumno

        updateAlumno(
            id: ID!
            name: String
            lastname: String
            mail: String
            phone: String
            street: String
            city: String
        ): Alumno

        deleteAlumno(id: ID!): Alumno 

    }

`

const resolvers={
    Query: {
        alumnoCount: () => alumnos.length,
        findAlumno: (root, args) => {
            const{name}=args
            return alumnos.find(alumno => alumno.name===name)
        },
        allAlumnos: () => alumnos
    },

    Mutation:{
        addAlumno:(root, args)=> {
            const alumno = {...args, id: uuid()};
            alumnos.push(alumno);
            return alumno
        },

        updateAlumno: (root, args) => {
            const {id, name, lastname, mail, phone, street, city} = args;
            const alumno = alumnos.find(a => a.id === id);
            
            if (!alumno) {
                throw new UserInputError('Alumno no encontrado');
            }

            if (name !== undefined) alumno.name = name;
            if (lastname !== undefined) alumno.lastname = lastname;
            if (mail !== undefined) alumno.mail = mail;
            if (phone !== undefined) alumno.phone = phone;
            if (street !== undefined) alumno.street = street;
            if (city !== undefined) alumno.city = city;

            return alumno;
        },

        deleteAlumno: (root, args) => {
            const {id} = args;
            const index = alumnos.findIndex(a => a.id === id);

            if (index === -1) {
            throw new UserInputError('Alumno no encontrado');
            }
            const [deletedAlumno] = alumnos.splice(index, 1);
            return deletedAlumno;
        }

    },

    Alumno: {
        address: (root)=>{
            return{
                street: root.street,
                city: root.city
            }
        } 
    }    
}






const server = new ApolloServer({
    typeDefs: definicion,
    resolvers
})

server.listen().then(({url}) => {
    console.log(`Server ready at ${url}`)
})