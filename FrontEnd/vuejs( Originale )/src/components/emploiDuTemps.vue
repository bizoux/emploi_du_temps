<template>
  <div>
    <Center><h1>Générer Emploi du Temps</h1></Center>
    <center>
      <Knob v-model="value" :min="-50" :max="50"></Knob><br>
      <form @submit.prevent="generateTimetable">
        <label for="startDate">Date de départ:</label>
        <input type="date" v-model="startDate" required />
        <button type="submit">Générer</button>
      </form>
    </center>
    <!-- <Inputotp v-model="value2"></Inputotp><br>
    <FloatLabel>
      <input type="text" id="username" v-model="value3"/>
      <label for="username">ANARANA</label>
    </FloatLabel><br>

    <FloatLabel>
      <input type="text" id="username" v-model="value3"/>
      <label for="username">FANAMPINY ANARANA</label>
    </FloatLabel><br> -->
    
    

    <!-- Emploi du temps pour L1 -->
    <div id="pdf-content-l1" style="padding: 100px;">
      <h2>Emploi du Temps - L1</h2>
      <table class="timetable">
        <thead>
          <tr>
            <th>Date</th>
            <th v-for="(timeSlot, index) in timeSlots" :key="index">{{ formatTimeSlot(timeSlot) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(day, index) in uniqueDays" :key="index">
            <td>{{ formatDate(day) }}</td>
            <td v-for="timeSlot in timeSlots" :key="timeSlot">
              <div v-if="timetableL1[day] && timetableL1[day][timeSlot]">
                <div style="display: flex;align-items: center;justify-content: space-around;">
                  <div v-for="(course, courseIndex) in timetableL1[day][timeSlot]" :key="courseIndex">
                    <strong>{{ course.Libelle }}</strong><br>
                    {{ course.Prenom }}<br>
                    Salle: {{ course.NumSalle }}<br>
                    {{ course.NomParcour }}
                  </div>  
                </div>
              </div>
              <div v-else style="padding: 30px;">-</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Emploi du temps pour L2 -->
    <div id="pdf-content-l2" style="padding: 100px;">
      <h2>Emploi du Temps - L2</h2>
      <table class="timetable">
        <thead>
          <tr>
            <th>Date</th>
            <th v-for="(timeSlot, index) in timeSlots" :key="index">{{ formatTimeSlot(timeSlot) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(day, index) in uniqueDays" :key="index">
            <td>{{ formatDate(day) }}</td>
            <td v-for="timeSlot in timeSlots" :key="timeSlot">
              <div v-if="timetableL2[day] && timetableL2[day][timeSlot]">
                <div style="display: flex;align-items: center;justify-content: space-around;">
                  <div v-for="(course, courseIndex) in timetableL2[day][timeSlot]" :key="courseIndex">
                    <strong>{{ course.Libelle }}</strong><br>
                    {{ course.Prenom }}<br>
                    Salle: {{ course.NumSalle }}<br>
                    {{ course.NomParcour }}
                  </div>  
                </div>
              </div>
              <div v-else style="padding: 30px;">-</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>



        <!-- Emploi du temps pour L3 -->
        <div id="pdf-content-l2" style="padding: 100px;">
          <h2>Emploi du Temps - L3</h2>
          <table class="timetable">
            <thead>
              <tr>
                <th>Date</th>
                <th v-for="(timeSlot, index) in timeSlots" :key="index">{{ formatTimeSlot(timeSlot) }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(day, index) in uniqueDays" :key="index">
                <td>{{ formatDate(day) }}</td>
                <td v-for="timeSlot in timeSlots" :key="timeSlot">
                  <div v-if="timetableL3[day] && timetableL3[day][timeSlot]">
                    <div style="display: flex;align-items: center;justify-content: space-around;">
                      <div v-for="(course, courseIndex) in timetableL3[day][timeSlot]" :key="courseIndex">
                        <strong>{{ course.Libelle }}</strong><br>
                        {{ course.Prenom }}<br>
                        Salle: {{ course.NumSalle }}<br>
                        {{ course.NomParcour }}
                      </div>  
                    </div>
                  </div>
                  <div v-else style="padding: 30px;">-</div>
                </td>
              </tr>
            </tbody>



            

          </table>
        </div>
    
        <!-- Emploi du temps pour M1 -->
        <div id="pdf-content-l2" style="padding: 100px;">
          <h2>Emploi du Temps - M1</h2>
          <table class="timetable">
            <thead>
              <tr>
                <th>Date</th>
                <th v-for="(timeSlot, index) in timeSlots" :key="index">{{ formatTimeSlot(timeSlot) }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(day, index) in uniqueDays" :key="index">
                <td>{{ formatDate(day) }}</td>
                <td v-for="timeSlot in timeSlots" :key="timeSlot">
                  <div v-if="timetableM1[day] && timetableM1[day][timeSlot]">
                    <div style="display: flex;align-items: center;justify-content: space-around;">
                      <div v-for="(course, courseIndex) in timetableM1[day][timeSlot]" :key="courseIndex">
                        <strong>{{ course.Libelle }}</strong><br>
                        {{ course.Prenom }}<br>
                        Salle: {{ course.NumSalle }}<br>
                        {{ course.NomParcour }}
                      </div>  
                    </div>
                  </div>
                  <div v-else style="padding: 30px;">-</div>
                </td>
              </tr>
            </tbody>



            

          </table>
        </div>
    
        <!-- Emploi du temps pour M2 -->
        <div id="pdf-content-l2" style="padding: 100px;">
          <h2>Emploi du Temps - M2</h2>
          <table class="timetable">
            <thead>
              <tr>
                <th>Date</th>
                <th v-for="(timeSlot, index) in timeSlots" :key="index">{{ formatTimeSlot(timeSlot) }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(day, index) in uniqueDays" :key="index">
                <td>{{ formatDate(day) }}</td>
                <td v-for="timeSlot in timeSlots" :key="timeSlot">
                  <div v-if="timetableM2[day] && timetableM2[day][timeSlot]">
                    <div style="display: flex;align-items: center;justify-content: space-around;">
                      <div v-for="(course, courseIndex) in timetableM2[day][timeSlot]" :key="courseIndex">
                        <strong>{{ course.Libelle }}</strong><br>
                        {{ course.Prenom }}<br>
                        Salle: {{ course.NumSalle }}<br>
                        {{ course.NomParcour }}
                      </div>  
                    </div>
                  </div>
                  <div v-else style="padding: 30px;">-</div>
                </td>
              </tr>
            </tbody>



            

          </table>
        </div>
    
    
    
    
        <center><button @click="generatePdfL1L2" class="btn btn-secondary">Hamoaka PDF</button></center>
  </div>

<br>



</template>
<script>

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from 'axios';

export default {

  data() {
    return {
      value:"20",
      value2:"",
      value3:"",
      startDate: '',
      timeSlots: [],
      timetableL1: {},
      timetableL2: {},
      timetableL3: {},
      timetableM1: {},
      timetableM2: {},
      uniqueDays: [],
    };
  },
  mounted() {
    this.fetchTimetable();
  },
  methods: {
    generatePdfL1L2() {
      const l1Element = document.getElementById("pdf-content-l1");
      const l2Element = document.getElementById("pdf-content-l2");

      // Générer PDF pour L1
      html2canvas(l1Element, { scale: 4 }).then((canvasL1) => {
        const imgDataL1 = canvasL1.toDataURL("image/png");
        const pdf = new jsPDF("l", "pt", "a4");
        const pdfWidth = pdf.internal.pageSize.width;
        const pdfHeight = pdf.internal.pageSize.height;
        const imgWidth = pdfWidth;
        const imgHeightL1 = (canvasL1.height * imgWidth) / canvasL1.width;
        pdf.addImage(imgDataL1, "PNG", 0, 0, imgWidth, imgHeightL1);

        // Ajouter L2 à la page suivante
        html2canvas(l2Element, { scale: 4 }).then((canvasL2) => {
          const imgDataL2 = canvasL2.toDataURL("image/png");
          const imgHeightL2 = (canvasL2.height * imgWidth) / canvasL2.width;
          pdf.addPage();
          pdf.addImage(imgDataL2, "PNG", 0, 0, imgWidth, imgHeightL2);

          // Sauvegarder le PDF
          pdf.save("emploidutemps_L1_L2.pdf");
        });
      });
    },

    generateTimetable() {
      axios.post('http://localhost:3000/generate-timetable', { startDate: this.startDate })
        .then(() => {
          alert('Emploi du temps généré avec succès');
          this.fetchTimetable();
        })
        .catch(error => {
          console.error('Erreur lors de la génération de l\'emploi du temps :', error);
        });
    },

    fetchTimetable() {
      axios.get('http://localhost:3000/timetable')
        .then(response => {
          this.organizeTimetable(response.data);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération de l\'emploi du temps :', error);
        });
    },

    organizeTimetable(data) {
  // Initialisation des jours et créneaux horaires uniques
  const jours = new Set();
  const horaires = new Set();

  // Parcourir toutes les données
  data.forEach(entry => {
    const day = entry.Date;
    const timeSlot = `${entry.HeureDeb} - ${entry.HeureFin}`;
    const niveau = entry.NomNiveau;

    jours.add(day);  // Ajouter le jour unique
    horaires.add(timeSlot);  // Ajouter le créneau unique

    // Organiser l'emploi du temps selon le niveau (L1, L2, L3, M1, M2)
    if (niveau === 'L1') {
      if (!this.timetableL1[day]) {
        this.timetableL1[day] = {};
      }

      if (!this.timetableL1[day][timeSlot]) {
        this.timetableL1[day][timeSlot] = [];
      }

      this.timetableL1[day][timeSlot].push(entry);
    }

    if (niveau === 'L2') {
      if (!this.timetableL2[day]) {
        this.timetableL2[day] = {};
      }

      if (!this.timetableL2[day][timeSlot]) {
        this.timetableL2[day][timeSlot] = [];
      }

      this.timetableL2[day][timeSlot].push(entry);
    }

    if (niveau === 'L3') {
      if (!this.timetableL3[day]) {
        this.timetableL3[day] = {};
      }

      if (!this.timetableL3[day][timeSlot]) {
        this.timetableL3[day][timeSlot] = [];
      }

      this.timetableL3[day][timeSlot].push(entry);
    }

    if (niveau === 'M1') {
      if (!this.timetableM1[day]) {
        this.timetableM1[day] = {};
      }

      if (!this.timetableM1[day][timeSlot]) {
        this.timetableM1[day][timeSlot] = [];
      }

      this.timetableM1[day][timeSlot].push(entry);
    }

    if (niveau === 'M2') {
      if (!this.timetableM2[day]) {
        this.timetableM2[day] = {};
      }

      if (!this.timetableM2[day][timeSlot]) {
        this.timetableM2[day][timeSlot] = [];
      }

      this.timetableM2[day][timeSlot].push(entry);
    }

  });

  // Conserver les jours et horaires triés
  this.uniqueDays = Array.from(jours).sort();
  this.timeSlots = Array.from(horaires).sort();
},


    formatDate(date) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('fr-FR', options);
    },
    
    formatTimeSlot(timeSlot) {
      const [start, end] = timeSlot.split(' - ');
      return `${start} - ${end}`;
    },
  }
}
</script>

<style scoped>
.timetable {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}
.timetable td, .timetable th {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
.timetable th {
  background-color: #f2f2f2;
  font-weight: bold;
}
</style>