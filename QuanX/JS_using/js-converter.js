 / /   W h e t h e r   t o   o p e n   t h e   o u t p u t 
 c o n s t   v e r b o s e   =   t r u e ; 
 c o n s t   u r l   =   $ r e q u e s t . u r l ; 
 l e t   b o d y   =   $ r e s p o n s e . b o d y ; 
 
 i f   ( b o d y . i n d e x O f ( ' $ h t t p C l i e n t ' )   ! = =   - 1   & &   b o d y . i n d e x O f ( ' $ t a s k ' )   ! = =   - 1 )   { 
         / /   I f   a l r e a d y   a d a p t   f o r   m u l t i - p l a t f o r m ,   s k i p   c o n v e r t i n g . 
         $ d o n e ( {   b o d y   } ) ; 
 }   e l s e   { 
         c o n s t   p a t t e r n   =   / \ / \ * [ \ s \ S ] * ? \ * \ / | ( [ ^ \ \ : ] | ^ ) \ / \ / . * $ / ; 
         c o n s t   c o n v e r t e r   =   " \ / * * * *   S t a r t   c o n v e r s i o n   s c r i p t   * * * * \ / \ r \ n l e t   i s Q u a n t u m u l t X = $ t a s k ! = u n d e f i n e d ; l e t   i s S u r g e = $ h t t p C l i e n t ! = u n d e f i n e d ; l e t   i s L o o n = i s S u r g e & & t y p e o f   $ l o o n ! = u n d e f i n e d ; v a r   $ t a s k = i s Q u a n t u m u l t X ? $ t a s k : { } ; v a r   $ h t t p C l i e n t = i s S u r g e ? $ h t t p C l i e n t : { } ; v a r   $ p r e f s = i s Q u a n t u m u l t X ? $ p r e f s : { } ; v a r   $ p e r s i s t e n t S t o r e = i s S u r g e ? $ p e r s i s t e n t S t o r e : { } ; v a r   $ n o t i f y = i s Q u a n t u m u l t X ? $ n o t i f y : { } ; v a r   $ n o t i f i c a t i o n = i s S u r g e ? $ n o t i f i c a t i o n : { } ; i f ( i s Q u a n t u m u l t X ) { v a r   e r r o r I n f o = { e r r o r : \ " \ " , } ; $ h t t p C l i e n t = { g e t : ( u r l , c b ) = > { v a r   u r l O b j ; i f ( t y p e o f   u r l = = \ " s t r i n g \ " ) { u r l O b j = { u r l : u r l , } } e l s e { u r l O b j = u r l } \ r \ n $ t a s k . f e t c h ( u r l O b j ) . t h e n ( ( r e s p o n s e ) = > { c b ( u n d e f i n e d , r e s p o n s e , r e s p o n s e . b o d y ) } , ( r e a s o n ) = > { e r r o r I n f o . e r r o r = r e a s o n . e r r o r ; c b ( e r r o r I n f o , r e s p o n s e , \ " \ " ) } ) } , p o s t : ( u r l , c b ) = > { v a r   u r l O b j ; i f ( t y p e o f   u r l = = \ " s t r i n g \ " ) { u r l O b j = { u r l : u r l , } } e l s e { u r l O b j = u r l } \ r \ n u r l . m e t h o d = \ " P O S T \ " ; $ t a s k . f e t c h ( u r l O b j ) . t h e n ( ( r e s p o n s e ) = > { c b ( u n d e f i n e d , r e s p o n s e , r e s p o n s e . b o d y ) } , ( r e a s o n ) = > { e r r o r I n f o . e r r o r = r e a s o n . e r r o r ; c b ( e r r o r I n f o , r e s p o n s e , \ " \ " ) } ) } , } } \ r \ n i f ( i s S u r g e ) { $ t a s k = { f e t c h : ( u r l ) = > { r e t u r n   n e w   P r o m i s e ( ( r e s o l v e , r e j e c t ) = > { i f ( u r l . m e t h o d = = \ " P O S T \ " ) { $ h t t p C l i e n t . p o s t ( u r l , ( e r r o r , r e s p o n s e , d a t a ) = > { i f ( r e s p o n s e ) { r e s p o n s e . b o d y = d a t a ; r e s o l v e ( r e s p o n s e , { e r r o r : e r r o r , } ) } e l s e { r e s o l v e ( n u l l , { e r r o r : e r r o r , } ) } } ) } e l s e { $ h t t p C l i e n t . g e t ( u r l , ( e r r o r , r e s p o n s e , d a t a ) = > { i f ( r e s p o n s e ) { r e s p o n s e . b o d y = d a t a ; r e s o l v e ( r e s p o n s e , { e r r o r : e r r o r , } ) } e l s e { r e s o l v e ( n u l l , { e r r o r : e r r o r , } ) } } ) } } ) } , } } \ r \ n i f ( i s Q u a n t u m u l t X ) { $ p e r s i s t e n t S t o r e = { r e a d : ( k e y ) = > { r e t u r n   $ p r e f s . v a l u e F o r K e y ( k e y ) } , w r i t e : ( v a l , k e y ) = > { r e t u r n   $ p r e f s . s e t V a l u e F o r K e y ( v a l , k e y ) } , } } \ r \ n i f ( i s S u r g e ) { $ p r e f s = { v a l u e F o r K e y : ( k e y ) = > { r e t u r n   $ p e r s i s t e n t S t o r e . r e a d ( k e y ) } , s e t V a l u e F o r K e y : ( v a l , k e y ) = > { r e t u r n   $ p e r s i s t e n t S t o r e . w r i t e ( v a l , k e y ) } , } } \ r \ n i f ( i s Q u a n t u m u l t X ) { $ n o t i f y = ( ( n o t i f y ) = > { r e t u r n   f u n c t i o n ( t i t l e , s u b T i t l e , d e t a i l , u r l = u n d e f i n e d ) { d e t a i l = u r l = = = u n d e f i n e d ? d e t a i l : ` $ { d e t a i l } \ \ n C l i c k   t h e   l i n k   t o   j u m p :   $ { u r l } ` ; n o t i f y ( t i t l e , s u b T i t l e , d e t a i l ) } } ) ( $ n o t i f y ) ; $ n o t i f i c a t i o n = { p o s t : ( t i t l e , s u b T i t l e , d e t a i l , u r l = u n d e f i n e d ) = > { d e t a i l = u r l = = = u n d e f i n e d ? d e t a i l : ` $ { d e t a i l } \ \ n C l i c k   t h e   l i n k   t o   j u m p :   $ { u r l } ` ; $ n o t i f y ( t i t l e , s u b T i t l e , d e t a i l ) } , } } \ r \ n i f ( i s S u r g e & & ! i s L o o n ) { $ n o t i f i c a t i o n . p o s t = ( ( n o t i f y ) = > { r e t u r n   f u n c t i o n ( t i t l e , s u b T i t l e , d e t a i l , u r l = u n d e f i n e d ) { d e t a i l = u r l = = = u n d e f i n e d ? d e t a i l : ` $ { d e t a i l } \ \ n C l i c k   t h e   l i n k   t o   j u m p :   $ { u r l } ` ; n o t i f y . c a l l ( $ n o t i f i c a t i o n , t i t l e , s u b T i t l e , d e t a i l ) } } ) ( $ n o t i f i c a t i o n . p o s t ) ; $ n o t i f y = ( t i t l e , s u b T i t l e , d e t a i l , u r l = u n d e f i n e d ) = > { d e t a i l = u r l = = = u n d e f i n e d ? d e t a i l : ` $ { d e t a i l } \ \ n C l i c k   t h e   l i n k   t o   j u m p :   $ { u r l } ` ; $ n o t i f i c a t i o n . p o s t ( t i t l e , s u b T i t l e , d e t a i l ) } } \ r \ n i f ( i s L o o n ) { $ n o t i f y = ( t i t l e , s u b T i t l e , d e t a i l , u r l = u n d e f i n e d ) = > { $ n o t i f i c a t i o n . p o s t ( t i t l e , s u b T i t l e , d e t a i l , u r l ) } } \ r \ n \ / * * * *   C o n v e r s i o n   s u c c e e d e d   * * * * \ / " ; 
 
         l e t   h e a d e r   =   b o d y . m a t c h ( p a t t e r n ) [ 0 ]   +   ' \ n \ n '   +   c o n v e r t e r ; 
         c o n s t   c o n v e r t e d   =   b o d y . r e p l a c e ( p a t t e r n ,   h e a d e r ) ; 
 
         $ d o n e ( {   b o d y :   c o n v e r t e d   } ) ; 
         $ n o t i f y ( " S c r i p t   c o n v e r s i o n   s u c c e s s f u l !�<߉ " ,   " A u t o   m o d e   :   S u r g e | L o o n   t o   Q u a n t u m u l t   X " ,   u r l ) ; 
 }