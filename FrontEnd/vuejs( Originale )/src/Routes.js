import { createRouter, createWebHistory } from "vue-router";

import { auth } from "./auth";


// ROUTE DE L'APPLICATION

// import PageProtegee from "./components/PageProtegee.vue";
// import PageAuthentification from "./components/PageAuthentification.vue";
// import PageInscription from "./components/PageInscription.vue";
// import Authentification from "./components/Authentification.vue";
// import Accueil from "./components/Accueil.vue";
// import Declaration from "./components/Declaration.vue";
// import AjoutDeclaration from "./components/AjoutDeclaration.vue";
// import EditerDeclaration from "./components/EditerDeclaration.vue";
// import Paiement from "./components/Paiement.vue";
// import AjoutPaiement from "./components/AjoutPaiement.vue";
// import Annexe from "./components/Annexe.vue";
// import AfficheDeclaration from "./components/AfficheDeclaration.vue";
// import RecepisseDeclaration from "./components/RecepisseDeclaration.vue";
// import MenuPrincipale from "./components/MenuPrincipale.vue";
// import creerCompteBancaire from "./components/NouveauCompteBancaire.vue";

// import FileUpload from "./components/FileUpload.vue";

// import Ampidirina from "./components/Ampidirina.vue";
// import HavoakaPdf from "./components/HavoakaPdf.vue";
// import Design from "./components/Design.vue";
// import transition from "./components/transition.vue";
// import Menu from "./components/Menu.vue";
// import Portfolio from "./components/CV.vue";
// import box from "./components/box.vue";
// import boxTest from "./components/boxTest.vue";

// import Accueil from "./components/Accueil.vue";
// import Apropos from "./components/Apropos.vue";
// import Contact from "./components/Contact.vue";

// import admin from "./components/adminDashboard.vue";
// import user from "./components/UtilisateurDashboard.vue";
// import Login from "./components/Login.vue";
// import tableau from "./components/TableauCopy.vue";

// import responsive from "./components/responsive.vue";

// import Chat from "./components/Chat.vue";

import emploiDuTemps from "./components/emploiDuTemps.vue";




// TESTE ROUTE

// import page1 from "./components/page1.vue";
// import page2 from "./components/page2.vue";
// import page3 from "./components/page3.vue";
// import AfficheBar from "./components/AfficheBar.vue";
// import Menu from "./components/Menu.vue";
// import MenuProtegee from "./components/MenuProtegee.vue";
// import premier from "./components/premier.vue";
// import composant1 from "./components/composant1.vue";
// import composant2 from "./components/composant2.vue";


                                        // FAMPIRANTIANA

// import HamiditraAnjaraFamp from "./components/FamenoanaAnjaraFampirantiana.vue";
// import pdfFamp from "./components/HamoakaPdfFampirantiana.vue";
// import FanaovanaFanovana from "./components/FanaovanaFanovana.vue";
// import Fanovana from "./components/Fanovana.vue";


const routes = [
    // {
    //     path:"/",
    //     name:"PageAuthentification",
    //     component: PageAuthentification,
    //     meta:{
    //         guest: true,
    //         title:"DGI | OnlineNIF",
    //     }
    // },
    // {
    //     path:"/",
    //     name:"Ampidirina",
    //     component: Ampidirina,
    //     meta:{
    //         title:"JW.ORG | FITONDRANA MICRO",
    //     }
    // },
    // {
    //     path:"/",
    //     name:"FamenoanaAnjaraFampirantiana",
    //     component: HamiditraAnjaraFamp,
    //     meta:{
    //         title:"Hampiditra Anjara Fampirantiana",
    //     }
    // },
    {
        path:"/",
        name:"emploiDuTemps",
        component: emploiDuTemps,
        meta:{
            title:"emploiDuTemps",
        }
    },
    // {
    //     path:"/Chat",
    //     name:"Chat",
    //     component: Chat,
    //     meta:{
    //         title:"Chat",
    //     }
    // },
    // {
    //     path:"/pdfFamp",
    //     name:"HamoakaPdfFampirantiana",
    //     component: pdfFamp,
    //     meta:{
    //         title:"pdfFamp",
    //     }
    // },
    // {
    //     path:"/responsive",
    //     name:"responsive",
    //     component: responsive,
    //     meta:{
    //         title:"responsive",
    //     }
    // },
    // {
    //          path:"/:id",
    //          name:"Fanovana",
    //          component: Fanovana,
    //          meta:{
    //            title:"Fanovana ny anjara"
    //       }
    //  },
    //  {
    //     path:"/FanaovanaFanovana",
    //     name:"FanaovanaFanovana",
    //     component: FanaovanaFanovana,
    //     meta:{
    //       title:"FanovanaAnjara"
    //  }
    //  },
    // {
    //     path:"/Login",
    //     name:"Login",
    //     component: Login,
    //     meta:{
    //         title:"Login",
    //     }
    // },
    // {
    //     path:"/tableau",
    //     name:"tableau",
    //     component: tableau,
    //     meta:{
    //         title:"tableau",
    //     }
    // },
    // {
    //     path:"/Ampidirina",
    //     name:"Ampidirina",
    //     component: Ampidirina,
    //     meta:{
    //         title:"Ampidirina",
    //     }
    // },
    // {
    //     path:"/admin",
    //     name:"admin",
    //     component: admin,
    //     meta:{
    //         title:"admin",
    //         requiredAuth: true,
    //         role: 'admin'
    //     }
    // },
    // {
    //     path:"/user",
    //     name:"user",
    //     component: user,
    //     meta:{
    //         title:"user",
    //         requiredAuth: true,
    //         role: 'user'
    //     }
    // },
    // {
    //     path:"/Apropos",
    //     name:"Apropos",
    //     component: Apropos,
    //     meta:{
    //         title:"Apropos",
    //     }
    // },
    // {
    //     path:"/Contact",
    //     name:"Contact",
    //     component: Contact,
    //     meta:{
    //         title:"Contact",
    //     }
    // },
   
    // {
    //     path:"/box",
    //     name:"box",
    //     component: box,
    //     meta:{
    //         title:"box",
    //     }
    // },
    // {
    //     path:"/boxTest",
    //     name:"boxTest",
    //     component: boxTest,
    //     meta:{
    //         title:"boxTest",
    //     }
    // },
    
    // {
    //     path:"/MaPage",
    //     name:"MaPage",
    //     component: Portfolio,
    //     meta:{
    //         title:"MaPage",
    //     }
    // },
    // {
    //     path:"/Menu",
    //     name:"Menu",
    //     component: Menu,
    //     meta:{
    //         title:"Menu",
    //     }
    // },
    // {
    //     path:"/transition",
    //     name:"transition",
    //     component: transition,
    //     meta:{
    //         title:"transition",
    //     }
    // },
    // {
    //     path:"/HavoakaPdf",
    //     name:"HavoakaPdf",
    //     component: HavoakaPdf,
    //     meta:{
    //         title:"Hamoaka PDF",
    //     }
    // },
    // {
    //     path:"/Design",
    //     name:"Design",
    //     component: Design,
    //     meta:{
    //         title:"Design",
    //     }
    // },
    // {
    //     path:"/upload",
    //     name:"FileUpload",
    //     component: FileUpload,
    //     meta:{
    //         title:"FileUpload",
    //     }
    // }
    
    // {
    //     path:"/PageInscription",
    //     name:"PageInscription",
    //     component: PageInscription,
    //     meta:{
    //         guest: true,
    //         title:"S'inscrire"
    //     }
    // },
    // {
    //     path:"/Authentification",
    //     name:"Authentification",
    //     component: Authentification,
    //     meta:{
    //         title:"Authentification",
    //     }
    // },
    
    // {
    //     path:"/",
    //     name:"Accueil",
    //     component: Accueil,
    //     meta:{
    //         title:"Accueil"
    //     }
    // },
    // {
    //     path:"/Declaration",
    //     name:"Declaration",
    //     component: Declaration,
    //     meta:{
    //         requiresAuth: true,
    //         title:"Déclaration fiscale"
    //     }
    // },
    // {
    //     path:"/AjoutDeclaration",
    //     name:"AjoutDeclaration",
    //     component: AjoutDeclaration,
    //     meta:{
    //         requiresAuth: true,
    //         title:"Nouveau déclaration fiscale"
    //     }
    // },
    // {
    //     path:"/EditerDeclaration/:idDeclaration",
    //     name:"EditerDeclaration",
    //     component: EditerDeclaration,
    //     meta:{
    //         requiresAuth: true,
    //         title:"Editer la déclaration"
    //     }
    // },
    // {
    //     path:"/Paiement",
    //     name:"Paiement",
    //     component: Paiement,
    //     meta:{
    //         requiresAuth: true,
    //         title:"Paiement"
    //     }
    // },
    // {
    //     path:"/AjoutPaiement",
    //     name:"AjoutPaiement",
    //     component: AjoutPaiement,
    //     meta:{
    //         requiresAuth: true,
    //         title:"Nouveau paiement"
    //     }
    // },
    // {
    //     path:"/CreerCompteBancaire",
    //     name:"NouveauCompteBancaire",
    //     component: creerCompteBancaire,
    //     meta:{
    //         requiresAuth: true,
    //         title:"Nouveau paiement"
    //     }
    // },
    
    // {
    //     path:"/premier",
    //     name:"premier",
    //     component: premier,
    //     meta:{
    //         title:"premier"
    //     }
    // },
    // {
    //     path:"/composant1",
    //     name:"composant1",
    //     component: composant1,
    //     meta:{
    //         title:"composant1"
    //     }
    // },
    // {
    //     path:"/composant2",
    //     name:"composant2",
    //     component: composant2,
    //     meta:{
    //         title:"composant2"
    //     }
    // },
    // {
    //     path:"/Annexe",
    //     name:"Annexe",
    //     component: Annexe,
    //     meta:{
    //         requiresAuth: true,
    //         title:"Annexe à la déclaration"
    //     }
    // },
    // {
    //     path:"/AfficheDeclaration/:idContribuable",
    //     name:"AfficheDeclaration",
    //     component: AfficheDeclaration,
    //     meta:{
    //         requiresAuth: true,
    //         title:"Affichage du declaration"
    //     }
    // },
    // {
    //     path:"/AfficheRecepisser/:RefPaiement",
    //     name:"RecepisseDeclaration",
    //     component: RecepisseDeclaration,
    //     meta:{
    //         requiresAuth: true,
    //         title:"Recepissé de déclaration"
    //     }
    // },
    // {
    //     path:"/MenuPrincipale",
    //     name:"MenuPrincipale",
    //     component: MenuPrincipale,
    //     meta:{
    //         title:"MenuPrincipale"
    //     }
    // },
    // {
    //     path:"/PageProtegee",
    //     name:"PageProtegee",
    //     component: PageProtegee,
    //     meta:{
    //         title:"Page protégée | Nom de l'application"
    //     }
    // },
    // {
    //     path:"/Menu",
    //     name:"Menu",
    //     component: Menu,
    //     meta:{
    //         title:"Menu"
    //     }
    // },
    // {
    //     path:"/page1",
    //     name:"Page1",
    //     component: page1,
    //     meta:{
    //         title:"Page1"
    //     }
    // },
    // {
    //     path:"/page2",
    //     name:"Page2",
    //     component: page2,
    //     meta:{
    //         title:"Page 2"
    //     }
    // },
    // {
    //     path:"/page3",
    //     name:"Page3",
    //     component: page3,
    //     meta:{
    //         title:"Page 3"
    //     }
    // },
    // {
    //     path:"/AfficheBar",
    //     name:"AfficheBar",
    //     component: AfficheBar,
    //     meta:{
    //         title:"AfficheBar"
    //     }
    // }
];


const router = createRouter({
    history: createWebHistory(),
    routes: routes
});
export default router;
router.afterEach((to) => (document.title = to.meta.title));
// router.beforeEach((to, from,next) =>{
//     const isAuthenticated = localStorage.getItem('token');//Vérifiez si l'utilisateur est authentifié
//     if(to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated){
//         next('/');
//     }
//     else if(to.matched.some(record => record.meta.guest) && isAuthenticated){
//         next({name : 'Accueil'});
//     }
//     else{
//         next();
//     }
// });


router.beforeEach((to, from,next) =>{
    const isAuthenticated = auth.isAuthenticated;
    const userRole = auth.getRole();
    if(to.matched.some(record => record.meta.requiresAuth)){
        if(!isAuthenticated){
	        next('/');
	    }
        else if(to.meta.role && to.meta.role !== userRole){
            next('/');
        }
    else{
        next();
    }
}
else{
	next();
}
});