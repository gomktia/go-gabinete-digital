
// Simulation Script for Access Rules Logic
console.log("--- INICIANDO TESTE DE REGRAS DE ACESSO (Feat Gating) ---");

const testRules = () => {
    const plans = ['free', 'starter', 'pro', 'enterprise'];
    const features = ['docs', 'ai', 'radar', 'genealogy', 'map'];

    // Replicating the logic from TenantContext.tsx for verification
    const checkLogic = (plan, feature) => {
        switch (feature) {
            case 'docs': // PDF Generation
                return plan === 'starter' || plan === 'pro' || plan === 'enterprise';
            case 'ai':   // Basic AI
                return plan === 'starter' || plan === 'pro' || plan === 'enterprise';
            case 'radar': // Money features
                return plan === 'pro' || plan === 'enterprise';
            case 'genealogy':
                return plan === 'pro' || plan === 'enterprise';
            case 'map':
                return plan === 'enterprise';
            default:
                return false;
        }
    };

    plans.forEach(plan => {
        console.log(`\nTesting Plan: [${plan.toUpperCase()}]`);
        features.forEach(feat => {
            const hasAccess = checkLogic(plan, feat);
            const status = hasAccess ? "✅ LIBERADO" : "🔒 BLOQUEADO";
            console.log(`- Feature '${feat}': ${status}`);
        });
    });
};

testRules();
